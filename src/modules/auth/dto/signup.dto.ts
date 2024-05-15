import { IsNotEmpty, IsEmail, IsIn, IsBoolean, MinLength } from "class-validator";
import { UserGender } from "src/common/enums/gender.enum";
import { UserStatus } from "src/common/enums/status.enum";

export class SignUpDTO {
    @IsNotEmpty()
    first_name: string;
  
    @IsNotEmpty()
    last_name: string;
  
    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email address' })
    email: string;
  
    @MinLength(6,{ message : 'Please enter minimum 6 character'})
    @IsNotEmpty()
    password: string;
    
    @MinLength(6,{ message : 'Please enter minimum 6 character'})
    @IsNotEmpty()  
    password_confirm: string;
  
    @IsNotEmpty()
    @IsIn(['member', 'admin','responsale'], { message: 'Invalid status' }) 
    status: UserStatus;
  
    @IsNotEmpty()
    @IsIn(['male', 'female'], { message: 'Invalid gender' }) 
    gender: UserGender
  
  
    @IsNotEmpty()
    birthDate: Date;
  
    @IsNotEmpty()
    rue: string;
  
    @IsNotEmpty()
    commune: string;
  
    @IsNotEmpty()
    ville: string;
  
    @IsNotEmpty()
    @IsBoolean()
    actif: boolean;
  
    @IsNotEmpty()
    gsm: string;
    constructor() {
      this.status = UserStatus.MEMBER; 
  }
  @IsNotEmpty()
  attributionDate : Date
  }