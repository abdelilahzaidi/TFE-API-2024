import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { SeanceEntity } from './entity/seance.entity';
import { SeanceService } from './seance.service';
import { SeanceCreateDTO } from '../user/dto/seance-create.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';

@Controller('seance')
export class SeanceController {
  constructor(
    private readonly seanceService: SeanceService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  @Get()
  async all(): Promise<SeanceEntity[]> {
    return await this.seanceService.getAllSeances();
  }
  @Post()
  async create(@Body() dto: SeanceCreateDTO): Promise<SeanceEntity> {
    console.log(dto);
    return await this.seanceService.createSeance(dto);
  }



  @Post(':id/participants')
  async insertParticipantAction(
    @Param('id') id: number,
    @Body() { userIds }: { userIds: number[] },
  ): Promise<SeanceEntity> {
    try {
      return await this.seanceService.insertParticipantAction(id, userIds);
    } catch (error) {
      console.log('In controller seance ', error);
      throw new InternalServerErrorException(
        "Une erreur est survenue lors de l'ajout des participants",
      );
    }
  }

  @Get(':seanceId')
  async getSeanceUsers(@Param('seanceId') seanceId: number): Promise<SeanceEntity[]> {
      console.log('Seance ID:', seanceId); 
      return await this.seanceService.findSeanceUserById(seanceId);
  }
  


 
}
