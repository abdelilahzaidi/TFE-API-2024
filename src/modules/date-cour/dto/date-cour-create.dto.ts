import { IsNotEmpty } from "class-validator";

export class CreateDateCourDTO{
    @IsNotEmpty()
    dateCour: Date;    
    
}