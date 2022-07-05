import {  IsString, IsOptional, IsDate, IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateProfileDto {
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsDate()
    dob: Date

    @IsOptional()
    managerId: number
}

