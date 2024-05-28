import { LevelEntity } from "src/modules/level/entity/level.entity";
import { TechnichalTypeEntity } from "src/modules/technical-type/entity/technical-type.entity";
import { TechnichalEntity } from "src/modules/technichal/entity/technichal.entity";

export interface ProgramI{
    id: number;
    title?: string;
    grade?: LevelEntity;
    technicals: TechnichalEntity[];
}