import { IsArray, IsNotEmpty, IsEnum, IsDate, IsNumber, IsDateString } from "class-validator";
import { TypeAbonnementEnum } from "src/common/enums/abonnement.enum";

export class CreateInvoiceDto {
    @IsArray() 
    @IsNumber({}, { each: true }) 
    @IsNotEmpty({ each: true })
    userIds: number[];
  
    @IsEnum(TypeAbonnementEnum)
    abonnementType: 'MENSUEL' | 'ANNUEL';
  
    @IsDateString() 
    @IsNotEmpty()
    dateEnvoie: string;
  
    @IsNumber() 
    @IsNotEmpty()
    montant: number;  
 
  }