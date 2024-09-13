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
    //Lister les 
    @Get()
    async all(): Promise<LevelI[]> {
      const levels= await this.levelService.all()
      levels.forEach(l =>{
       delete l.users
      })    
      //Ordonner les niveaux par id
      levels.sort(
        (a,b)=>a.id - b.id
      )
      console.log(levels)
      return levels;
    }
  //Lister les niveaux avec les pratiquants
  @Get('users')
  async allLevelsWithUsers(): Promise<LevelI[]> {
    const levels= await this.levelService.all()
    levels.forEach(l =>{
      l.users.forEach(u =>
        delete u.password
      )
    })   
    //Ordonner les niveaux par id
    levels.sort(
      (a,b)=>a.id - b.id
    ) 
    console.log(levels)
    return levels;
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
