import { ProgramEntity } from "src/modules/program/entity/program.entity";
import { TechnichalTypeEntity } from "src/modules/technical-type/entity/technical-type.entity";

export interface ITechnichal {
    id: number;
    nom?: string;
    description?: string;
    programs: ProgramEntity[]; 
    technichalType: TechnichalTypeEntity | null;  
  }
  
  