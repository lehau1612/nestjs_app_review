import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserProfile } from "src/entity/UserProfile";
import { IPaginationOptions } from "src/interface/index.interface";
import { Repository, getManager } from "typeorm";
import { UpdateProfileDto } from "src/dto/user.dto";
import { Config } from "src/entity/Config";
import config from "../config/index";
import { UserGroup } from "src/entity/UserGroup";
import { IResponse } from "src/interface/response.interface";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserProfile) private profileRepo: Repository<UserProfile>,
        @InjectRepository(Config) private configRepo: Repository<Config>,
        @InjectRepository(UserGroup) private userGroupRepo: Repository<UserGroup>
    ) { }

    async getListUser(pagination: IPaginationOptions) {
        return this.profileRepo.find({
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit,
            select: [
                'userId', 'email', 'firstName', 'lastName', 'dob', 'position', 'managerId'
            ]
        })
    }

    async getProfile(userId: number, managerId: number) {
        try {
            const entityManager = getManager()
            if (!managerId || managerId == null) {
                const profile1 = await entityManager.query(
                    `select u.user_id,u.email,u.first_name,u.last_name, u.position, r.names as role_name,ug.group_id, g.code as group
                    from user_profile u,user_group ug,groups g, user_role ur, roles r
                    where u.user_id = ug.user_id
                    and ug.group_id = g.id
                    and u.user_id = ur.user_id 
                    and ur.role_id = r.id
                    and u.user_id = ${userId}`)
                console.log('----profile:', profile1);

                return profile1;
            } else if (managerId) {
                const profile = await entityManager.query(
                    `WITH item AS (
                        SELECT u.user_id,u.email,u.first_name,u.last_name, u.dob, u.position, r.names as role_name,ug.group_id,  g.code as group, u.manager_id
                        FROM user_profile as u,user_group ug,groups g,user_role ur,roles r
                        WHERE  u.user_id= ug.user_id
                        AND ug.group_id = g.id 
                        AND u.user_id = ur.user_id 
                        AND ur.role_id = r.id 
                        AND u.user_id = ${userId}
                    )
                    SELECT item.*, up.first_name as first_name_manager, up.last_name as last_name_manager,up.position as position_manager
                    FROM user_profile AS up  JOIN item 
                    ON item.manager_id = up.user_id; 
                    `
                )
                return profile;
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }

    //danh sach nhan vien ma quan ly danh gia
    async listEmployeeUnderManagement(userId: number) {
        try {
            const entityManager = getManager()
            const rawData = await entityManager.query(
                `SELECT up.user_id, up.email, up.first_name, up.last_name, up.dob, up.manager_id,up.position 
                from user_profile up  
                where manager_id = '${userId}'; `
            )
            
            return rawData
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }

    async updateProfile(userId: number, data: UpdateProfileDto): Promise<UserProfile> {
        try {
            const profile = await this.profileRepo.findOne({ id: +userId })
            profile.firstName = data.firstName,
                profile.lastName = data.lastName,
                profile.dob = data.dob
            profile.managerId = data.managerId
            return await this.profileRepo.save(profile)
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }

    //list danh sach danh gia
    async listOfReviewContent() {
        const infoReview = await this.configRepo
            .createQueryBuilder('config')
            .select('config.id config_id')
            .addSelect('config.name config_name')
            .addSelect('config.groups config_group')
            .addSelect('config.value config_value')
            .orderBy('priority')
            .getRawMany()
        return infoReview;
    }

    async listColleaguesSameGroup(userId: number) {

        try {
            const entityManager = getManager()
            const group = await entityManager.query(
                `select ug.group_id from user_group ug where user_id = ${userId}`
            )
            
            let partners = []
            if (Array.isArray(group)) {
                for (const gp of group) {  
                    const listPartner = await entityManager.query(
                        `SELECT  up.user_id,up.first_name, up.last_name 
                        from user_group ug, user_profile up
                        where up.user_id = ug.user_id and up.user_id not in (${userId})
                        and ug.group_id in (${gp.group_id}) 
                        `
                    )
                    if (listPartner && listPartner.length) {
                        for (const partner of listPartner) {
                            partners.push(partner)
                        }
                    }
                }
            }
            const filteredArr = partners.reduce((acc, current) => {
                const x = acc.find(item => item.user_id === current.user_id);
                if (!x) {
                  return acc.concat([current]);
                } else {
                  return acc;
                }
              }, []);
              
            return filteredArr
        } catch (error) {
            throw error
        }
    }

    //ket qua cua user

    async getResult(userId: number) {
        try {
            const entityManager = getManager()
            let data = {
                point: undefined,
                reportSelf: [],
                feedback: [],
                listPartner:[],
                generalAssessment:[]
            }
            let point = {
                pointPerformance : undefined,
                pointBonus: undefined,
                pointAttitude: undefined,
                pointMedium : undefined,
                pointTotal: undefined
                
            }
            let pointPerformance = await entityManager.query(
                `select c.id,r.point_self,r.point_manager from result r,config c 
                where r.config_id = c.id and user_id =${userId} and c.types = 'performance_capacity'`)

            // lay diem nang luc va chat luong cong viec
            if (pointPerformance && pointPerformance.length) {
                for (const item of pointPerformance) {
                    const pointSelf = item.point_self
                    const pointManager = item.point_manager
                    let total = pointSelf * (config.valuePerformance.self) + pointManager * (config.valuePerformance.manager)
                    point.pointPerformance = total
                }
            }

            //lay dem bonus
            let pointBonus = await entityManager.query(
                `select c.id, r.point_self,r.point_manager from result r, config c 
                where r.config_id = c.id and user_id = ${userId} and c.types = 'bonus'`
            )

            if (pointBonus && pointBonus.length) {
                pointBonus.forEach((item) => {
                    const pointSelf = item.point_self
                    const pointManager = item.point_manager;
                    let total = pointSelf * (config.valueBonus.self) + pointManager * (config.valueBonus.manager);

                    point.pointBonus = total
                })
            }

            //lay diem thai do  team work
            let pointAttitude = await entityManager.query(
                `select r.user_id ,r.point_self,r.point_manager, rpT.point_medium  from result r,config c ,
                    (select sum(point_total)/count(*) as point_medium from report_partner rp where partner_id =${userId}) rpT 
                    where r.config_id = c.id and r.user_id =47 and c.types = 'attitude_teamwork';                        
                `
            )

            if (pointAttitude && pointAttitude.length) {
                pointAttitude.forEach((item) => {
                    const point_medium = item.point_medium;
                    point.pointMedium = Math.round(point_medium * 100) / 100 ;
                    let total = item.point_self*(config.valueAttitudeTeamwork.self) + item.point_manager*(config.valueAttitudeTeamwork.manager) + point_medium*(config.valueAttitudeTeamwork.partner);
                    point.pointAttitude = Math.round(total * 100) / 100 ;
                })
            }
            
            point.pointTotal = point.pointPerformance*(config.valueTotal.performance) + point.pointBonus*(config.valueTotal.bonus) + point.pointAttitude*(config.valueTotal.attitude)
            
            data.point = point
           

            //lay dnah gia ban than

            const reportSelf = await entityManager.query(
                `select c.id, r.description, r.point_self, r.point_manager 
                from config c 
                left join result r on r.config_id = c.id
                left join user_profile up on up.user_id = r.user_id
                where up.user_id = ${userId}
                order by c.priority `
            )

            data.reportSelf =reportSelf

            //lay feedback ve ban than

            let feedbackFor4 = await entityManager.query(`select rp.feedback as content from report_partner rp where partner_id = ${userId}`)

            data.feedback =feedbackFor4

            // lay danh gia cua ban than ve dong nghiep
            const listPartner = await entityManager.query(
                `select up.first_name ,up.last_name ,rp.feedback ,rp.point_attitude ,rp.point_teamwork ,rp.point_total  
                from report_partner rp , user_profile up where rp.partner_id = up.user_id and rp.user_id =${userId};
                `)
            data.listPartner=  listPartner 

            // lay danh gia chung 
            let generalAssessment = await entityManager.query(`select ga.content from general_assessment ga`)
            data.generalAssessment= generalAssessment 
            return data;
        } catch (error) {
            throw error
        }
    }

}