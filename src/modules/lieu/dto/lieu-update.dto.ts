import { PartialType } from "@nestjs/mapped-types";
import { CreateLieuDto } from "./lieu-create.dto";

export class UpdateLieuDto extends PartialType(CreateLieuDto) {}