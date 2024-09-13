import { UpdateProgramTechnicalsDto } from './dto/Update-program-technichal.dto';
import { ProgramI } from './interface/program.interface';
import { ProgramService } from './program.service';
import { Body, Controller, Get, Param, Put } from '@nestjs/common';

@Controller('program')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}
  //Lister les programmes par id
  @Get()
  async all(): Promise<ProgramI[]> {
    const programs = await this.programService.all();
    //ordonner les programmes par id
   programs.forEach( program => program.technicals.forEach(
    p=>{
     delete p['programs']
    }
   ))
    programs.sort(
      (a,b)=>a.id - b.id
    )
    return await programs
  }

  @Get(':id/technichal')
  async getProgramById(@Param('id') id: number): Promise<ProgramI> {
    return await this.programService.findOneByProgram(id);
  }

  @Put('update-technicals')
  async updateProgramTechnicals(
    @Body() updateProgramTechnicalsDto: UpdateProgramTechnicalsDto,
  ) {
    const { programId, technicalIds } = updateProgramTechnicalsDto;
    return await this.programService.updateProgramTechnicals(
      programId,
      technicalIds,
    );
  }
}
