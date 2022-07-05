import { Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/User';
import { UserProfile } from 'src/entity/UserProfile';
import { Role } from 'src/entity/Role';
import { JwtModule } from '@nestjs/jwt';
import { UserRole } from 'src/entity/UserRole';
import 'dotenv/config'
import { UserService } from 'src/service/user.service';
import { UserGroup } from 'src/entity/UserGroup';
import { Config } from 'src/entity/Config';
import { Result } from 'src/entity/Result';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/strategy/local.strategy';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { Group } from 'src/entity/Group';
import { GeneralAssessment } from 'src/entity/GeneralAssessment';
import { ReportPartner } from 'src/entity/ReportPartner';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile, Role, UserRole,UserGroup,Config,Result,UserGroup,Group,GeneralAssessment,ReportPartner]),
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT,
      signOptions:{expiresIn: '1d'}
    }),
  ],
  providers: [AuthService, UserService, LocalStrategy,JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
