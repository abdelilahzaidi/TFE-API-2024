import { PartialType } from "@nestjs/mapped-types";
import { CreateEventDto } from "./event-create.dto";

export class UpdateEventDto extends PartialType(CreateEventDto) {}