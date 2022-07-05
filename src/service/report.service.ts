import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository, getManager } from "typeorm";
import { Result } from "src/entity/Result";
import { GeneralAssessment } from "src/entity/GeneralAssessment";
import { ReportPartner } from "src/entity/ReportPartner";

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(Result) private resultRepo: Repository<Result>,
        @InjectRepository(GeneralAssessment) private generalAssessmentRepo: Repository<GeneralAssessment>,
        @InjectRepository(ReportPartner) private reportPartnerRepo: Repository<ReportPartner>
    ) { }

    async report(userId: number, data) {
        try {
            if (data && data.reviewSelf) {
                await this.reportSelf(userId, data.reviewSelf)
            } else {
                throw  new HttpException('Khong co danh gia ban than', HttpStatus.BAD_REQUEST)
            }
            if (data && data.reviewPartner) {
                 await this.reportPartner(userId, data.reviewPartner)
            } else {
                throw new HttpException('khong co danh gia dong doi', HttpStatus.BAD_REQUEST)
            }
            if (data && data.generalAssessment) {

                 await this.generalAssessment(userId, data.generalAssessment)

            } else {
                throw new HttpException('khong co danh gia chung', HttpStatus.BAD_REQUEST)
            }
            throw new HttpException('Success', HttpStatus.OK)

        } catch (error) {
            // console.log('---error', error);
            throw error
        }
    }

    async reportSelf(userId: number, data) {
        try {
            data.map(async (item) => {
                const entityManager = getManager()
                const find = await this.resultRepo.find({
                    where: { configId: item.configId, userId: userId }
                })

                if (find.length > 0) {
                    await entityManager.query(
                        `update result set point_self = ${item.pointSelf},description ='${item.description}'
                    where user_id= ${userId} and config_id = ${item.configId}`,
                    )
                } else {
                    await entityManager.query(
                        `insert into result(config_id,user_id,description,point_self) values 
                    (${item.configId},${userId},'${item.description}',${item.pointSelf})
                    `
                    )
                }
            })
            return data;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    async reportPartner(userId: number, data) {
        try {
            const entityManager = getManager()
            data.forEach(
                async (item) => {
                    const find = await this.reportPartnerRepo.find({
                        where: { userId: userId, partnerId: item.partnerId }
                    })
                    if (find && find.length > 0) {
                        await entityManager.query(
                            `UPDATE report_partner 
                            set point_attitude = ${item.pointAttitude}, 
                            point_teamwork = ${item.pointTeamwork}, 
                            point_total= ${item.pointTotal} ,
                            feedback = '${item.feedback}'
                            where user_id = ${userId}
                            and partner_id = ${item.partnerId}
                            `
                        )
                    } else {
                        await entityManager.query(
                            `INSERT INTO report_partner(user_id,partner_id,point_attitude, point_teamwork, point_total,feedback) 
                            VALUES(${userId}, ${item.partnerId}, ${item.pointAttitude}, ${item.pointTeamwork}, ${item.pointTotal},'${item.feedback}')`
                        )
                    }
                }
            )
            return data;
        } catch (error) {
            throw error
        }
    }
    //danh gia chung 
    async generalAssessment(userId: number, data) {
        try {
            const entityManager = getManager()
            const findId = await this.generalAssessmentRepo.findOne({ userId: userId })

            if (findId) {
                let updateContent = await entityManager.query(
                    `update general_assessment set content = '${data.content}' where user_id = ${userId}`
                )
                return updateContent
            } else {
                let insertContent = await entityManager.query(`insert into general_assessment(user_id, content) values(${userId},'${data.content}')`)
                return insertContent
            }
        } catch (error) {
            throw error
        }
    }


    async managerReport(managerId: number, userId:number,data) {
        //console.log('===managerId', managerId);
        //console.log('userId',userId);
        try {
            const entityManager = getManager()
            const viewPoint = await entityManager.query(`select r.point_self from result r where r.user_id = ${userId}`)
           // console.log('viewPoint', viewPoint);
            if ( viewPoint.length === 0) {
                throw new HttpException('User chưa thực hiện đánh giá.', HttpStatus.BAD_REQUEST)
            } else {
                data.forEach(async (item)=> {
                    // console.log('===item',item);
                    
                    await entityManager.query(
                        `update result set point_manager= ${item.pointManager},manager_id = ${managerId}
                                            where user_id= ${userId} 
                                            and config_id = ${item.configId}
                                            `,
                    )
                })
                return data;
            }

        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }



}