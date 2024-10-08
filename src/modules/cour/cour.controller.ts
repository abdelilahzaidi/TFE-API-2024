import { Body, Controller, Get, Post } from '@nestjs/common';
import { CourService } from './cour.service';
import { CourEntity } from './entity/cour.entity';
import { CreateCourDTO } from './dto/cour-create.dto';

@Controller('cour')
export class CourController {
    constructor(
        private readonly courService : CourService
    ){}
    /*Lister tous les cours*/
    @Get()
    async all():Promise<CourEntity[]>{
        return await this.courService.all()
    }
    /*Creation d'un cour*/
    @Post()
    async create(@Body() dto : CreateCourDTO): Promise<CourEntity> {
      console.log(dto)
      return await this.courService.createCour(dto);
    }
}
