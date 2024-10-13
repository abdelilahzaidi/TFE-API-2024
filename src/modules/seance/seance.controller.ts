import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { SeanceEntity } from './entity/seance.entity';
import { SeanceService } from './seance.service';

import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { SeanceCreateDTO } from './dto/seance-create.dto';
import { UpdateSeanceDto } from './dto/seance-update.dto';

@Controller('seance')
export class SeanceController {
  logger: any;
  constructor(
    private readonly seanceService: SeanceService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  @Get()
  async all(): Promise<SeanceEntity[]> {
    return await this.seanceService.getAllSeances();
  }


  @Get(':seanceId')
  async getSeanceUsers(
    @Param('seanceId') seanceId: number,
  ): Promise<SeanceEntity[]> {
    console.log('Seance ID:', seanceId);
    return await this.seanceService.findSeanceUserById(seanceId);
  }

  // **DELETE pour supprimer une séance**
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.seanceService.removeSeance(id);
  }

  // Endpoint pour générer une séance avec plusieurs utilisateurs
  @Post('create-seance')
  
  async createSeance(
    @Body('objectifDuCour') objectifDuCour: string,
    @Body('rue') rue: string,
    @Body('commune') commune: string,
    @Body('ville') ville: string,
    @Body('jour') jour: string,  // DayOfWeek enum
    @Body('heureDebut') heureDebut: string,
    @Body('heureFin') heureFin: string,
    @Body('dateCour') dateCour: Date
  ): Promise<SeanceEntity | null> {
    return this.seanceService.generateSeance(
      objectifDuCour,
      rue,
      commune,
      ville,
      jour as 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche',  // cast the day
      heureDebut,
      heureFin,
      dateCour
    );
  }
  @Delete(':id')
  async deleteSeance(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.seanceService.removeSeance(id);
  }

  @Put(':id')
  async updateSeance(@Param('id') id: number, @Body() updateSeanceDto: UpdateSeanceDto) {
    const updatedSeance = await this.seanceService.updateSeance(id, updateSeanceDto);
    if (!updatedSeance) {
      throw new HttpException('Séance non trouvée', HttpStatus.NOT_FOUND);
    }
    return updatedSeance;
  }

  @Get(':id')
  async getSeanceById(@Param('id') id: number): Promise<SeanceEntity> {
    return this.seanceService.getByIdSeance(id);
  }
 
}
