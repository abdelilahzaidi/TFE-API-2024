import { ProgramI } from './interface/program.interface';
import { ProgramService } from './program.service';
import { Controller, Get } from '@nestjs/common';

@Controller('program')
export class ProgramController {
    constructor(
        private readonly programService : ProgramService
    ){}
    @Get()
    async all():Promise<ProgramI[]>{
        return await this.programService.all();
    }
}
