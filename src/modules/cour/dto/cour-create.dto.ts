import { IsNotEmpty } from "class-validator";

export class CreateCourDTO{
    @IsNotEmpty()
    objectifDuCour: string;    
    lieuId: number;
}