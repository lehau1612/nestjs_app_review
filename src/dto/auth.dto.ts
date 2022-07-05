import { Matches, MinLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';
export class LoginDto {
  @IsEmail()
   email: string;
   
  @IsNotEmpty()
   password: string;
}

export class RegisterUserDto {
  userId: number

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail({ message: 'email is not valid' })
  @IsNotEmpty({ message: 'email is require' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  message: ' too wepasswordak',
  })
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  dob: Date
  
  @IsNotEmpty()
  position: string

  @IsNotEmpty()
  roleId: number

  @IsNotEmpty()
  managerId: number

  @IsNotEmpty()
  groupId: number[]
}


