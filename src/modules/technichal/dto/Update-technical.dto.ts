import { PartialType } from "@nestjs/mapped-types";
import { CreateTechnicalDto } from "./create-technical.dto";

export class TechnichalUpdateDTO extends PartialType(CreateTechnicalDto){}