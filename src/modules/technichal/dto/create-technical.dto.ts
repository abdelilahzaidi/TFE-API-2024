import { IsNotEmpty, IsOptional, IsNumber, IsArray } from "class-validator";

export class CreateTechnicalDto {
   
    @IsNotEmpty()
    nom: string;
  
    @IsNotEmpty()
    description: string;
  
    @IsOptional()
    @IsNumber()
    technichalTypeId?: number;
  
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    programIds?: number[];
  }




 
  
  