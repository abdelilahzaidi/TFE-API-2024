import { IsNotEmpty } from "class-validator";

export class CreateLieuDto {
    @IsNotEmpty()
    rue: string;   
    
    @IsNotEmpty()
    commune: string;   

    @IsNotEmpty()
    ville: string;   
}