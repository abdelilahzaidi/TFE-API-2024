import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { TechnichalService } from './technichal.service';
import { TechnichalEntity } from './entity/technichal.entity';
import { CreateTechnicalDto } from './dto/create-technical.dto';
import { ITechnichal } from './interface/technical.interface';

@Controller('technichal')
export class TechnichalController {
  constructor(private readonly technichalService: TechnichalService) {}

  @Get()
  async all(): Promise<TechnichalEntity[]> {
    const technichal =await this.technichalService.all();
    technichal.sort(
      (a,b)=>a.id - b.id
    )
    return technichal
  }
  @Get(':id')
  async gettechnicalById(@Param('id') id: number):Promise<TechnichalEntity>{
    return await this.technichalService.findById(id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTechnicalDto: CreateTechnicalDto): Promise<ITechnichal> {
    return this.technichalService.createTechnichal(createTechnicalDto);
  }

}
