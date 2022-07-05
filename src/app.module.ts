import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/dbConnect';
import { AuthModule } from './module/auth.module';
import { ReportModule } from './module/report.module';
import { UserModule } from './module/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UserModule,
    AuthModule,
    ReportModule
  ],

})
export class AppModule { }
