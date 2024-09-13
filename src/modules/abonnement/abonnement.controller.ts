import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AbonnementEntity } from './entity/abonnement.entity';
import { AbonnementService } from './abonnement.service';

@Controller('abonnement')
export class AbonnementController {
  constructor(private readonly abonnementService: AbonnementService) {}
  @Get()
  async all(): Promise<any[]> {
    return await this.abonnementService.all();
  }

  // @Get(':id/type-abonnement')
  // async allByType(@Param('id') id : number):Promise<any>{
  //     return await this.abonnementService.findAllUsersByType(id)
  // }

  //Recuperer un abonnement par type d'abonnement
  @Get(':id/type-abonnement')
  async getUsersByType(@Param('typeId') typeId: number) {
    const users = await this.abonnementService.findAllUsersByType(typeId);
    return users;
  }
  //Création d'un abonnement
  @Post()
  async createAbonnement(
    @Body('userId') userId: number,
    @Body('typeAbonnementId') typeAbonnementId: number,
    @Body('dateDebut') dateDebut: Date,
    @Body('dateFin') dateFin: Date,
  ): Promise<AbonnementEntity> {
    return this.abonnementService.createAbonnement(
      userId,
      typeAbonnementId,
      dateDebut,
      dateFin,
    );
  }
}
