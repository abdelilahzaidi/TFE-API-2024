import { IsNotEmpty, IsArray, ArrayNotEmpty, IsDateString, IsEnum } from "class-validator";
import { CompareDates } from "src/common/decorators/isGreaterThanDate.decorator";

export enum DayOfWeek {
    LUNDI = 'lundi',
    MARDI = 'mardi',
    MERCREDI = 'mercredi',
    JEUDI = 'jeudi',
    VENDREDI = 'vendredi',
    SAMEDI = 'samedi',
    DIMANCHE = 'dimanche',
  }

  export class SeanceCreateDTO {
    @IsNotEmpty()
    objectifDuCour: string;
  
    @IsNotEmpty()
    rue: string;
  
    @IsNotEmpty()
    commune: string;
  
    @IsNotEmpty()
    ville: string;
  
    @IsNotEmpty()
    //@IsEnum(DayOfWeek, { message: 'Le jour doit être un jour valide de la semaine' })
    jour: DayOfWeek;
  
    @IsNotEmpty()
    //@CompareDates('heureFin', { message: "L'heure de fin doit être supérieure à l'heure de début." })
    heureDebut: string;
  
    @IsNotEmpty()
    heureFin: string;
  
    @IsNotEmpty()
    @IsDateString()
    dateCour: Date;
  }
  
  
  






