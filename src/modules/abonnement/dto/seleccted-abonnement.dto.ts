import { Type } from "class-transformer";
import { IsNumber, IsDate } from "class-validator";
import { CompareDates } from "src/common/decorators/isGreaterThanDate.decorator";

export class SelectAbonnementDTO {
    @IsNumber()
    userId: number;
  
    @IsNumber()
    typeAbonnementId: number;

    @Type(() => Date) // Transforme la chaîne en instance de Date
    @IsDate({ message: "dateDebut doit être une instance de Date" })
    dateDebut: Date;

    @Type(() => Date) // Transforme la chaîne en instance de Date
    @IsDate({ message: "dateDebut doit être une instance de Date" })
    @CompareDates('dateDebut', { message: 'dateFin doit être supérieure à dateDebut' })
    dateFin: Date;
  }