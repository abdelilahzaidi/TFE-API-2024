import { Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Patch } from '@nestjs/common';
import { SeanceUserService } from './seance-user.service';
import { SeanceUserEntity } from './entity/seance-user.entity';

@Controller('seance-user')
export class SeanceUserController {
    constructor(
        private readonly seanceUserService : SeanceUserService
    ){}


    @Get()
    async allSeanceUser() : Promise<SeanceUserEntity[]> {
        return await this.seanceUserService.findAllSeanceUser()
    }

    @Get(':seanceId')
    async getSeanceUsers(@Param('seanceId') seanceId: number): Promise<SeanceUserEntity[]> {
        console.log('Seance ID:', seanceId); // Log pour vérifier la valeur de seanceId
        return this.seanceUserService.filterBySeanceId(seanceId);
    }

    // Route pour mettre à jour la présence pour une liste d'utilisateurs
    @Patch(':seanceId/presence')
    async updatePresence(
      @Param('seanceId') seanceId: number,
      @Body() body: { userIds: number[], presence: boolean }
    ) {
      try {
        console.log('Données reçues pour la mise à jour des présences:', body);
        const { userIds, presence } = body;
        
        // Appeler le service pour mettre à jour les présences
        const result = await this.seanceUserService.updateUserPresence(seanceId, userIds, presence);
  
        return { message: 'Présences mises à jour avec succès', result };
      } catch (error) {
        console.error('Erreur serveur lors de la mise à jour des présences:', error);
  
        // Retourner une erreur 500 en cas de problème
        if (error instanceof HttpException) {
          throw error;
        }
  
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
}
