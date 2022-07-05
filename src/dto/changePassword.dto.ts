import { Matches, MinLength, IsNotEmpty, IsString } from "class-validator";
import { Match } from "src/decorator/match.decorator";
export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: ' too wepasswordak',
    })
    @MinLength(8)
    passwordNew: string;

  
}

