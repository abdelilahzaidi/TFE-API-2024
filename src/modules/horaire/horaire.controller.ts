import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Status } from 'src/common/decorators/status.decorator';
import { UserStatus } from 'src/common/enums/status.enum';
import { StatusGuard } from 'src/common/guards/status.guards';
import { CreateHoraireDto } from './dto/horaire-create.dto';
import { HoraireEntity } from './entity/horaire.entity';
import { HoraireService } from './horaire.service';

@Controller('horaire')
export class HoraireController {
    constructor(
        private readonly horaireService : HoraireService
    ){}
    @Get()
    async all():Promise<HoraireEntity[]>{
        return await this.horaireService.all()
    }
    @UseGuards(StatusGuard)
    @Status(UserStatus.ADMIN)
    @Post()
    async create(@Body() dto : CreateHoraireDto): Promise<HoraireEntity> {
      console.log(dto)
      return await this.horaireService.createHoraire(dto);
    }

    @Get(':id')
    async getLieuById(@Param('id') id: number){
        return this.horaireService.findHoraireById(id)
    }
}
