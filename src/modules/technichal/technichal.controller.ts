import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TechnichalService } from './technichal.service';
import { TechnichalEntity } from './entity/technichal.entity';
import { CreateTechnicalDto } from './dto/create-technical.dto';
import { ITechnichal } from './interface/technical.interface';
import { TechnichalUpdateDTO } from './dto/Update-technical.dto';

@Controller('technichal')
export class TechnichalController {
  constructor(private readonly technichalService: TechnichalService) {}

  @Get()
  async all(): Promise<TechnichalEntity[]> {
    const technichal = await this.technichalService.all();
    technichal.sort((a, b) => a.id - b.id);
    return technichal;
  }
  @Get(':id')
  async gettechnicalById(@Param('id') id: number): Promise<TechnichalEntity> {
    return await this.technichalService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTechnicalDto: CreateTechnicalDto,
  ): Promise<ITechnichal> {
    return this.technichalService.createTechnichal(createTechnicalDto);
  }

  // @Put('update-technichal/:id')
  // async updateTechnichal(
  //   @Param('id') technichalId: number, // Récupérer l'ID de la technique depuis les paramètres de la route
  //   @Body() updateTechnicalDto: TechnichalUpdateDTO, // Récupérer les nouvelles données depuis le corps de la requête
  // ) {
  //   return await this.technichalService.updateTechnichal(
  //     technichalId,
  //     updateTechnicalDto,
  //   );
  // }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateTechnichalDto: TechnichalUpdateDTO,
  ): Promise<TechnichalEntity> {
    return this.technichalService.updateTechnichals(id, updateTechnichalDto);
  }
}
