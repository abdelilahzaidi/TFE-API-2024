import { IsArray, IsNotEmpty, IsEnum, IsDate, IsNumber, IsDateString } from "class-validator";
import { TypeAbonnementEnum } from "src/common/enums/abonnement.enum";

export class CreateInvoiceDto {
    @IsArray() // On s'assure que c'est un tableau
    @IsNumber({}, { each: true }) // On s'assure que chaque élément du tableau est un nombre
    @IsNotEmpty({ each: true })
    userIds: number[];
  
    @IsEnum(TypeAbonnementEnum)
    abonnementType: 'MENSUEL' | 'ANNUEL';
  
    @IsDateString() // On valide que la date est une chaîne au format ISO
    @IsNotEmpty()
    dateEnvoie: string;
  
    @IsNumber() // On s'assure que le montant est un nombre
    @IsNotEmpty()
    montant: number;  
 
  }