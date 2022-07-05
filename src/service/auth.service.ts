import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/entity/Role";
import { UserProfile } from "src/entity/UserProfile";
import { Repository, getConnection, getManager } from "typeorm";
import { User } from "src/entity/User";
import {  IUsers_Profile } from "src/interface/user.interface";
import * as bcrypt from 'bcryptjs';
import { UserRole } from "src/entity/UserRole";
import { LoginDto } from "src/dto/auth.dto";
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from "../dto/changePassword.dto";
import { ForgotPasswordDto } from "../dto/forgotPassword.dto";
import config from "../config/index";
import { UserGroup } from "src/entity/UserGroup";
@Injectable()
export class AuthService {
    constructor(
       
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService,

    ) { }
    async insertUser(email, password, transaction) {
        const userRepo = transaction.getRepository(User);
        const salt = await bcrypt.genSalt(4);
        const hashPassword = await bcrypt.hash(password, salt);
        const inputs = { email, password: hashPassword };
        const user = await userRepo.findOne({
            where: { email: email },
            select: ['id'],
        });
        if (user) {
            throw new HttpException("email already exist", HttpStatus.BAD_REQUEST)
        }
        const newUser = await userRepo.save(inputs);
        return newUser;

    }
    async insertProfile(transaction, userId, email, firstName, lastName, dob, managerId, position) {

        const profileRepo = transaction.getRepository(UserProfile)
        const inputs = { userId, email, firstName, lastName, dob, managerId, position }
        const newProfile = await profileRepo.save(inputs)
        return newProfile;
    }
    async addRole(roleId, userId, transaction) {
        const userRoleRepo = transaction.getRepository(UserRole)
        const inpust = { roleId, userId }
        const addRole = await userRoleRepo.save(inpust)
        return addRole;
    }

    async addGroup(userId, groupId: number[], transaction) {
        const userGroupRepo = transaction.getRepository(UserGroup)
        const group = []
        groupId.forEach(async (item: number) => {
            const inputs = { userId, groupId: item }
            console.log(item)
            const addGroup = await userGroupRepo.save(inputs)
            group.push(addGroup)
        })
        return group
    }
    async createUser({ ...params }: IUsers_Profile) {
        return await getConnection().transaction(async (transaction) => {
            const user = await this.insertUser(params.email, params.password, transaction);
            if (user){
                const profile = await this.insertProfile(transaction, user.id, params.email, params.firstName, params.lastName, params.dob, params.managerId, params.position);
                if (profile) {
                    const role = await this.addRole(params.roleId, user.id, transaction)
                    if (role) {
                        const group = await this.addGroup(user.id, params.groupId, transaction)
                        if(group){
                            return {...params};
                        }
                    }
                }
            }
            
        })
    }

    async login(data: LoginDto) {
        const user = await this.userRepo.findOne({ email: data.email })
        if (!user) throw new HttpException('The email not exist!!!', HttpStatus.BAD_REQUEST);
        const isTruePassword = await bcrypt.compareSync(data.password, user.password)
        if (!isTruePassword) {
            throw new HttpException('password invalid!!!', HttpStatus.FORBIDDEN);
        } else {
            const entityManager = getManager()
            const rawData = await entityManager.query(
                `select up.user_id, up.email, up.manager_id, r.names  
                from user_profile up, roles r, user_role ur 
                where up.user_id =ur.user_id 
                and ur.role_id  = r.id 
                and up.email = '${data.email}'`)
            if (rawData && rawData.length > 0) {
                const token = rawData[0];
                return {
                    status: HttpStatus.OK,
                    message: 'Login Success',
                    data: {
                        accessToken: this.jwtService.sign(token)
                    }
                }
            }
            return {
                status: HttpStatus.UNAUTHORIZED,
                message: 'Login Failed',
                data: {}
            }
        }
    }
    async changePassword(email: string,data: ChangePasswordDto): Promise<any> {        
        try {
            data.passwordNew = await bcrypt.hash(data.passwordNew, config.auth.saltRound)
            const changePassword  = await this.userRepo.update(email,{password: data.passwordNew});   
            return changePassword;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        } 
    }

    async forgotPassword(
        data: ForgotPasswordDto
    ): Promise<any> {
        const userUpdate = await this.userRepo.findOne({
            email: data.email
        })
        const passwordRand = Math.random().toString(36).slice(-8)
        userUpdate.password = await bcrypt.hash(passwordRand, config.auth.saltRound)
        return await this.userRepo.save(userUpdate)
    }


}
