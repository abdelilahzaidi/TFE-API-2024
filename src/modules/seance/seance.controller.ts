import { Controller, Get } from '@nestjs/common';
import { SeanceEntity } from './entity/seance.entity';
import { SeanceService } from './seance.service';

@Controller('seance')
export class SeanceController {
    constructor(
        private readonly seanceService: SeanceService,
        
      ) {}
      @Get()
      async all():Promise<SeanceEntity[]>{
        return await this.seanceService.getAllSeances()        
      }
    
}
