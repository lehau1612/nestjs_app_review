import {
  Body,
  Controller,
  Get,
  Put,
  Query, DefaultValuePipe, ParseIntPipe, HttpException,
  HttpStatus,
  UseGuards,
  Res, UsePipes
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { infinityPagination } from 'src/utils/pagination';
import {  UpdateProfileDto } from 'src/dto/user.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { User } from 'src/decorator/user.decorator';
import { ValidationPipe } from '../validator/validator.pipe'
import { IUsers } from 'src/interface/user.interface';
import { IResponse } from 'src/interface/response.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/list')
  @UsePipes(new ValidationPipe())
  async getListUser(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return infinityPagination(
      await this.userService.getListUser({ page, limit }),
      { page, limit }
    )
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get('/profile')
  async getProfile(
    @Res() res,
    @User() user: IUsers
  ) {
    try {
      const profile = await this.userService.getProfile(user.userId, user.managerId)
      return res.status(HttpStatus.OK).json({
        status: 200,
        message: 'Success',
        data: profile
      })
    } catch (error) {
      throw error
    }
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Put('/update-profile')
  async updateProfile(
    @User() user: IUsers,
    @Body() data: UpdateProfileDto
  ) {
    try {
      await this.userService.updateProfile(user.userId, data)
      return new HttpException('User Updated successfully!', HttpStatus.OK)
    } catch (error) {
      return new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }

  //danh sach noi dung danh gia
  @UsePipes(new ValidationPipe())
  @Get('/list-review-content')
  async listOfReviewContent(
    @Res() res,

  ): Promise<any> {
    try {
      const list = await this.userService.listOfReviewContent()
      if (list) {
        return res.status(HttpStatus.OK).json({
          status: 200,
          message: 'Success',
          data: list
        })
      }
      else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: 400,
          message: 'Failed',
          data: list
        })
      }
    } catch (error) {
      throw error
    }
  }

  //danh sach nhan vien thuoc quan ly danh gia
  @UseGuards(JwtAuthGuard)
  @Get('/list-staff-under-management')
  async listPartner(
    @Res() res,
    @User() user: IUsers,
  ) {
    try {
      const listStaff = await this.userService.listEmployeeUnderManagement(user.userId)      
      if ( user.roleName != 'manager') {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: 404,
          message: 'Not found',
          data: listStaff
        })
        
      }
      else {
        return res.status(HttpStatus.OK).json({      
          status: 200,
          message: 'Success',
          data: listStaff
        });
      }
    } catch (error) {
      throw error
    }
  }

  //list dong nghiep cung du an
  @UseGuards(JwtAuthGuard)
  @Get('/list-colleagues-same-group')
  async listColleaguesSameGroup(
    @Res() res,
    @User() user: IUsers,
  ) {
    try {
      const list = await this.userService.listColleaguesSameGroup(user.userId)
        return res.status(HttpStatus.OK).json({
          status: 200,
          message: 'Success',
          data: list
        });
    } catch (error) {
      throw error
    }
  }


  @UseGuards(JwtAuthGuard)
  @Get('/results')
  async getTotalPoint(
    @User() user: IUsers,
  ){
    try {
      return await this.userService.getResult(user.userId )
  
    } catch (error) {
      throw error
    }
  }
}