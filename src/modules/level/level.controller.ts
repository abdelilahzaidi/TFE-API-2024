import { Body, Controller, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { LevelEntity } from './entity/level.entity';
import { LevelService } from './level.service';
import { LevelI } from './interface/level.interface';
import { LevelUpdateDTO } from './dto/level-update.dto';

@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}
  @Get()
  async all(): Promise<LevelI[]> {
    return await this.levelService.all();
  }


  @Get(':id')
  async getLevelById(@Param('id', ParseIntPipe) id: number){
    return await this.levelService.findLevelById(id);
  }
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: LevelUpdateDTO
  ): Promise<LevelI> {
    return await this.levelService.update(id, body);
  }
}

