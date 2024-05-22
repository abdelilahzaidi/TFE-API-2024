import { PartialType } from "@nestjs/mapped-types";
import { LevelCreateDTO } from "./level-create.dto";


export class UserUpdateDTO extends PartialType(LevelCreateDTO){}