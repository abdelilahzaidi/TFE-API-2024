import { PartialType } from "@nestjs/mapped-types/dist/partial-type.helper";
import { CreateHoraireDto } from "./horaire-create.dto";

export class UpdateHoraireDto extends PartialType(CreateHoraireDto) {}