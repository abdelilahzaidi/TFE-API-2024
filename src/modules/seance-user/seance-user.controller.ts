import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SeanceUserService } from './seance-user.service';
import { SeanceUserEntity } from './entity/seance-user.entity';

@Controller('seance-user')
export class SeanceUserController {
  constructor(private readonly seanceUserService: SeanceUserService) {}

  @Get()
  async allSeanceUser(): Promise<SeanceUserEntity[]> {
    return await this.seanceUserService.findAllSeanceUser();
  }

  @Get(':seanceId')
  async getSeanceUsers(
    @Param('seanceId') seanceId: number,
  ): Promise<SeanceUserEntity[]> {
    console.log('Seance ID:', seanceId);
    return this.seanceUserService.filterBySeanceId(seanceId);
  }

  // @Patch(':seanceId/presence')
  // async updatePresence(
  //   @Param('seanceId') seanceId: number,
  //   @Body() body: { userIds: number[]; presence: boolean },
  // ) {
  //   try {
  //     console.log('Données reçues pour la mise à jour des présences:', body);
  //     const { userIds, presence } = body;

  //     const result = await this.seanceUserService.updateUserPresence(
  //       seanceId,
  //       userIds,
  //       presence,
  //     );

  //     return { message: 'Présences mises à jour avec succès', result };
  //   } catch (error) {
  //     console.error(
  //       'Erreur serveur lors de la mise à jour des présences:',
  //       error,
  //     );

  //     if (error instanceof HttpException) {
  //       throw error;
  //     }

  //     throw new HttpException(
  //       'Internal server error',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
  @Post(':seanceId/presence')
  async participateToSeance(
    @Param('seanceId') seanceId: number,
    @Body('userIds') userIds: number[],
  ) {
    // Appel à ton service pour participer à la séance
    return await this.seanceUserService.participateSeance(seanceId, userIds);
  }

  @Post(':seanceId/participate')
  async participateUserToSeance(
    @Param('seanceId') seanceId: number,
    @Body('userId') userId: number,
  ) {
    return await this.seanceUserService.participate(seanceId, userId);
  }

  // Endpoint pour mettre à jour les présences des utilisateurs d'une séance
  @Patch(':seanceId/presences')
  async updateUserPresences(
    @Param('seanceId') seanceId: number,
    @Body() body: { seanceUsers: { userId: number, presence: boolean }[] },
  ): Promise<SeanceUserEntity[]> {
    console.log('Body reçu :', body); // Log pour voir le contenu du body
    console.log('seanceUsers reçu :', body.seanceUsers); // Log pour voir si seanceUsers est bien un tableau
  
    return this.seanceUserService.updateUserPresences(seanceId, body.seanceUsers);
  }
  
}
