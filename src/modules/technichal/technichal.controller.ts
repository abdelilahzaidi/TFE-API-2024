import { Controller, Get, Param } from '@nestjs/common';
import { TechnichalService } from './technichal.service';
import { TechnichalEntity } from './entity/technichal.entity';

@Controller('technichal')
export class TechnichalController {
  constructor(private readonly technichalService: TechnichalService) {}

  @Get()
  async all(): Promise<TechnichalEntity[]> {
    return await this.technichalService.all();
  }
  @Get(':id')
  async gettechnicalById(@Param('id') id: number):Promise<TechnichalEntity>{
    return await this.technichalService.findById(id)
  }

}
