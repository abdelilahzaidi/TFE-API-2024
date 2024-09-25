import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { AbonnementEntity } from './entity/abonnement.entity';
import { AbonnementService } from './abonnement.service';
import { SelectAbonnementDTO } from './dto/seleccted-abonnement.dto';
import { AbonnementI } from './interface/abonnement.interfacte';

@Controller('abonnement')
export class AbonnementController {
  constructor(private readonly abonnementService: AbonnementService) {}
  @Get()
  async all(): Promise<any[]> {
    return await this.abonnementService.all();
  }

  //Recuperer un abonnement par type d'abonnement
  @Get(':id/type-abonnement')
  async getUsersByType(@Param('typeId') typeId: number) {
    const users = await this.abonnementService.findAllUsersByType(typeId);
    return users;
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.abonnementService.deleteAbonnement(id);
  }

  @Post('choose')
  async chooseAbonnement(
    @Body() selectAbonnementDTO: SelectAbonnementDTO,
  ): Promise<{ abonnement: AbonnementI; message: string }> {
    try {
      return await this.abonnementService.chooseAbonnement(selectAbonnementDTO);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
