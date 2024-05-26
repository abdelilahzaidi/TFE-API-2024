import { UserGender } from 'src/common/enums/gender.enum';
import { UserStatus } from 'src/common/enums/status.enum';
import { LevelEntity } from 'src/modules/level/entity/level.entity';
import { Column } from 'typeorm';

export interface UserI {
  
  id?: number;


  first_name: string;


  last_name: string;


  gender: UserGender;

 
  birthDate: Date;

 
  rue: string;

 
  commune: string;

  
  ville: string;


  actif: boolean;


  attributionDate: Date;

 
  gsm: string;

  
  email: string;

 
  password: string;

  
  status: UserStatus;

  level?:LevelEntity;
}
