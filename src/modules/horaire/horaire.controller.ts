import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Status } from 'src/common/decorators/status.decorator';
import { UserStatus } from 'src/common/enums/status.enum';
import { StatusGuard } from 'src/common/guards/status.guards';
import { CreateHoraireDto } from './dto/horaire-create.dto';
import { HoraireEntity } from './entity/horaire.entity';
import { HoraireService } from './horaire.service';
import { UpdateHoraireDto } from './dto/horaire-update.dto';

@Controller('horaire')
export class HoraireController {
  constructor(private readonly horaireService: HoraireService) {}
  //Liste Tous les horaire
  @Get()
  async all(): Promise<HoraireEntity[]> {
    return await this.horaireService.all();
  }
  //Création de l'horaire si user statut est admin
  @UseGuards(StatusGuard)
  @Status(UserStatus.ADMIN)
  @Post()
  async create(@Body() dto: CreateHoraireDto): Promise<HoraireEntity> {
    console.log(dto);
    return await this.horaireService.createHoraire(dto);
  }
  //Recuperer un lieu par id
  @Get(':id')
  async getLieuById(@Param('id') id: number) {
    return this.horaireService.findHoraireById(id);
  }
    // Mettre à jour un horaire
    
    @Put(':id')
    update(@Param('id') id: number, @Body() updateHoraireDto: UpdateHoraireDto): Promise<HoraireEntity> {
      return this.horaireService.update(id, updateHoraireDto);
    }
  
    // Supprimer un horaire
    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
      return this.horaireService.remove(id);
    }
      // Générer les horaires pour une semaine entière
  @Post('generate')
  generateHorairesForWeek(): Promise<void> {
    return this.horaireService.generateHorairesForWeek();
  }
}
