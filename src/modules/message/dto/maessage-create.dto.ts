import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  titre: string;

  @IsNotEmpty()
  @IsString()
  contenu: string;

  @IsArray()
  receiverIds: number[];

  @IsInt()
  senderId: number;


  dateHeureEnvoie : Date
}
