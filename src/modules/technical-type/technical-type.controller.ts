import { Body, Controller,Delete,Get, Param, Post, Put } from '@nestjs/common';
import { TechnicalTypeService } from './technical-type.service';
import { UpdateTechnicalTypeDto } from './dto/update-technical-type.dto';

@Controller('technical-type')
export class TechnicalTypeController {
    constructor(
        private readonly technichalTypeService : TechnicalTypeService
    ){}
    @Get()
    async all():Promise<any>{
        return await this.technichalTypeService.all();
    }
    @Get(':id')
    async getById(@Param('id') id : number):Promise<any>{
        return await this.technichalTypeService.findById(id)
    }

    @Put('associate')
    async associateTechnichalToType(
      @Body('technichalId') technichalId: number,
      @Body('typeId') typeId: number,
    ) {
      return this.technichalTypeService.associateTechnichalToType(technichalId, typeId);
    }

      // Mettre à jour un type technique
  @Put(':id')
  update(@Param('id') id: number, @Body() updateTechnicalTypeDto: UpdateTechnicalTypeDto) {
    return this.technichalTypeService.update(id, updateTechnicalTypeDto);
  }

  // Supprimer un type technique
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.technichalTypeService.remove(id);
  }
}
