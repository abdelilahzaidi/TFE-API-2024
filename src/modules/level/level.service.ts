import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LevelEntity } from './entity/level.entity';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(LevelEntity)
    private levelRepository: Repository<LevelEntity>,
  ) {}

  async all(): Promise<LevelEntity[]> {
    try {
      const levels = await this.levelRepository.find();
      console.log('Levels:', levels); // Log pour debug
      return levels;
    } catch (error) {
      console.error('Error fetching levels:', error); // Log les erreurs
      throw error;
    }
  }
}
