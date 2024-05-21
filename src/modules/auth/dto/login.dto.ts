import { IsNotEmpty, IsEmail, IsString, MinLength } from "class-validator";

export class LoginDTO{
    @IsNotEmpty()
    @IsEmail({},{message:'Please enter correct email address'})
     readonly email : string;
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
     readonly password : string;
}