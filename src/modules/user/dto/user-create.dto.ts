import { IsBoolean, IsEmail, IsIn, IsNotEmpty, MinLength } from "class-validator";
import { UserGender } from "src/common/enums/gender.enum";
import { UserStatus } from "src/common/enums/status.enum";


export class UserCreateDTO{
    @IsNotEmpty()
    first_name: string;
  
    @IsNotEmpty()
    last_name: string;
  
    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email address' })
    email: string;  
    
   
    @IsNotEmpty()
    @IsIn(['member', 'admin','responsable'], { message: 'Invalid status' }) 
    status?: UserStatus;


    @IsNotEmpty()
    @IsIn(['male', 'female'], { message: 'Invalid gender' }) 
    gender: UserGender;
  
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
    actif?: boolean; 
    
  
    @IsNotEmpty()
    gsm: string;

    @MinLength(6,{ message : 'Please enter minimum 6 character'})
    @IsNotEmpty()
    password: string;

  
   
}