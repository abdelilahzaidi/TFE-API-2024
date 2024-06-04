import { TypeAbonnementService } from './type-abonnement.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('type-abonnement')
export class TypeAbonnementController {
    constructor(
        private readonly typeAbonnementServive : TypeAbonnementService
    ){}

    @Get()
    async all():Promise<any[]>{
        return await this.typeAbonnementServive.all();
    }
    @Get(':id/abonnement')
    async getUsersByType(@Param('id') id: number) {
      const result = await this.typeAbonnementServive.findUsersByType(id);
      return result;
    }
}
