import { PartialType } from "@nestjs/mapped-types";
import { CreateEventDto } from "./event-crete.dto";

export class UpdateEventDto extends PartialType(CreateEventDto) {}