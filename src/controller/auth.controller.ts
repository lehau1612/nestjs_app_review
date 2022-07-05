import { Body, Controller, UsePipes, Post, HttpStatus, Res, UseGuards, HttpCode } from "@nestjs/common";
import { RegisterUserDto, LoginDto } from "src/dto/auth.dto";
import { AuthService } from "src/service/auth.service";
import { ApiOkResponse } from "@nestjs/swagger";
import { ChangePasswordDto } from "../dto/changePassword.dto";
import { ForgotPasswordDto } from "../dto/forgotPassword.dto";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { User } from "src/decorator/user.decorator";
import { IUsers } from "src/interface/user.interface";
import { ValidationPipe } from '../validator/validator.pipe'
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('/create')
    @HttpCode(HttpStatus.OK)
    async register(
        @Body() params: RegisterUserDto,
        @Res() res,
    ) {
        try {
            let createUser = await this.authService.createUser(params);
            return res.json({
                message: 'Create User Successfully!',
                status: 200,
                data: params
            });
        }
        catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Create User Failed!',
                status: 400,
                data: params
            });
        }
    }

    @Post('/login')
    async login(
        @Body() data: LoginDto,
    ) {
        return await this.authService.login(data);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/change-password')
    @UsePipes(new ValidationPipe())
    async changePassword(
        @Res() res,
        @User() user: IUsers,
        @Body() data: ChangePasswordDto
    ): Promise<any> {
        try {
            await this.authService.changePassword(user.email,data)

            return res.status(HttpStatus.OK).json({
                status: 200,
                message: 'Change Password Successfully!',
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: 400,
                message: 'Error: Change password failed!',

            });
        }
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Post('/forgot-password')
    async forgotPassword(
        @Res() res,
        @Body() data: ForgotPasswordDto
    ): Promise<any> {
        try {
            await this.authService.forgotPassword(data)
            return res.status(HttpStatus.OK).json({
                status: 200,
                message: 'Request Change Password Successfully!',
                data: data
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: 400,
                message: 'Error: Change password failed!',
                data: data
            });
        }
    }


   
}