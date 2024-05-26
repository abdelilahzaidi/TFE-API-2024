import { ProgramEntity } from "src/modules/program/entity/program.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";

export interface LevelI {
  id?: number;
  grade: string; 
  during: string;
  users?: UserEntity[];
  program?: ProgramEntity;
}
