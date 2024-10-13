import { IsNotEmpty, IsOptional, IsNumber, IsArray, IsString } from "class-validator";

// export class CreateTechnicalDto {
   
//     @IsString()
//     nom?: string;
  
//     @IsString()
//     description?: string;
  
//     @IsOptional()
//     @IsNumber()
//     technichalTypeId?: number;
  
//     @IsOptional()
//     @IsArray()
//     @IsNumber({}, { each: true })
//     programIds?: number[];
//   }

export class CreateTechnicalDto {
  @IsString()
  nom?: string;

  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  technicalTypeId?: number;  // Corriger ici "technicalTypeId" au lieu de "technichalTypeId"

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  programIds?: number[];
}



 
  
  