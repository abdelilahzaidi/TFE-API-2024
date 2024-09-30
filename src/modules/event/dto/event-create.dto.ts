import { IsString, IsDate, IsArray, IsNumber } from 'class-validator';

export class CreateEventDto {
  @IsString()
  nom: string;

  //@IsDate()
  dateDebut: Date;

  //@IsDate()
  dateFin: Date;

  @IsArray()
  @IsNumber({}, { each: true })
  userIds: number[];

  //@IsNumber()
  typeEventId: number; 
}
