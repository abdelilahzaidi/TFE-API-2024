import { Controller,Get, Param } from '@nestjs/common';
import { TechnicalTypeService } from './technical-type.service';

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
}
