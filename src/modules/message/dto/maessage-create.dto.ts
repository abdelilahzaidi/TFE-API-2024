import { IsArray, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {
    @IsString()
    titre: string;
  
    @IsNotEmpty()    @IsString()
    
    contenu: string;
  
    @IsArray()
    receivers: number[]; 
  
    @IsInt() 
    senderId: number;
  }