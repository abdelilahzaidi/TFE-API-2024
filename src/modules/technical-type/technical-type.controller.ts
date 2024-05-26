import { Controller,Get } from '@nestjs/common';
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
}
