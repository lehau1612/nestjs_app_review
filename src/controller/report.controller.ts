import {
    Body,
    Controller,
    Post,
    HttpStatus,
    UseGuards,
    Res, UsePipes, Param
  } from '@nestjs/common';
  import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
  import { User } from 'src/decorator/user.decorator';
  import { IUsers } from 'src/interface/user.interface';
  import { ValidationPipe } from '../validator/validator.pipe'
import { ReportService } from 'src/service/report.service';
  
  @Controller('users')
  export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @UseGuards(JwtAuthGuard)
    @Post('/report')
    async report(
      @User() user: IUsers,
        @Body() data
    ){
        try {
            return await this.reportService.report(user.userId,data)
        } catch (error) {
          // console.log('----error',error);     
            throw error;
        }
    }
      // quan ly danh gia nhan vien thuoc quan ly
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/review-manager/:userId')
  async reviewManager(
    @Res() res,
    @User() user: IUsers,
    @Body() data,
    @Param('userId') userId: number
  ) {
    try {
      await this.reportService.managerReport(user.userId,userId,data)
      if (user.roleName === 'manager') {
        return res.status(HttpStatus.OK).json({
          status: 200,
          message: 'Success'      
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: 400,
          message: 'Failed'
        });
      }
    } catch (error) {      
      throw error
    }
  }
  
  }