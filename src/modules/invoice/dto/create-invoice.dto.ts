import { IsArray, IsNotEmpty, IsEnum, IsDate, IsNumber, IsDateString } from "class-validator";
import { TypeAbonnementEnum } from "src/common/enums/abonnement.enum";

// export class CreateInvoiceDto {
//   @IsArray() 
//   @IsNumber({}, { each: true }) 
//   @IsNotEmpty({ each: true })
//   userIds: number[];

//   @IsEnum(TypeAbonnementEnum)
//   @IsNotEmpty() // Optionnel, car Enum est déjà implicite
//   abonnementType: 'MENSUEL' | 'ANNUEL';

//   @IsDateString() 
//   @IsNotEmpty()
//   dateEnvoie: string;

//   @IsNumber() 
//   @IsNotEmpty()
//   montant: number;  
// }

export class CreateInvoiceDto {
  @IsArray()
  userIds: number[];

  @IsEnum(['Mensuel', 'Annuel'])
  abonnementType: 'Mensuel' | 'Annuel';

  @IsDateString()
  dateEnvoie: string;

  @IsNumber()
  montant: number;
}