import { Controller, Get } from '@nestjs/common';
import { LevelEntity } from './entity/level.entity';
import { LevelService } from './level.service';
import { LevelI } from './interface/level.interface';

@Controller('level')
export class LevelController {
    constructor(
        private readonly levelService: LevelService,
        
      ) {}
      @Get()
      async all():Promise<LevelI[]>{
        return await this.levelService.all()
        
      }
}
