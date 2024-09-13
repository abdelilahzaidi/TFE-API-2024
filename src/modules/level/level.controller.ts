import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelI } from './interface/level.interface';
import { LevelUpdateDTO } from './dto/level-update.dto';

@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}
  //Lister les niveaux
  @Get()
  async all(): Promise<LevelI[]> {
    return await this.levelService.all();
  }
  //Recuperer un niveau par id
  @Get(':id')
  async getLevelById(@Param('id', ParseIntPipe) id: number) {
    return await this.levelService.findLevelById(id);
  }
  //Modifier un niveau
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: LevelUpdateDTO,
  ): Promise<LevelI> {
    return await this.levelService.update(id, body);
  }
}
