import { Module } from '@nestjs/common';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/User';
import { UserProfile } from 'src/entity/UserProfile';
import { Role } from 'src/entity/Role';
import { UserRole } from 'src/entity/UserRole';
import { Config } from 'src/entity/Config';
import { Result } from 'src/entity/Result';
import { UserGroup } from 'src/entity/UserGroup';
import { Group } from 'src/entity/Group';
import { GeneralAssessment } from 'src/entity/GeneralAssessment';
import { ReportPartner } from 'src/entity/ReportPartner';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile, Role, UserRole,Config,Result,UserGroup,Group,GeneralAssessment,ReportPartner]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule { }
