import { LevelEntity } from "src/modules/level/entity/level.entity";

export interface ProgramI{
    id:number;
    title?:string;
    grade?:LevelEntity;
}