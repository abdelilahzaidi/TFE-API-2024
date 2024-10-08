import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HoraireEntity } from './entity/horaire.entity';
import { CreateHoraireDto } from './dto/horaire-create.dto';

@Injectable()
export class HoraireService {
    constructor(
        @InjectRepository(HoraireEntity)
        private readonly horaireRepository: Repository<HoraireEntity>,
      ) { }
    
      async all(): Promise<HoraireEntity[]> {
        return await this.horaireRepository.find();
      }
    
      async createHoraire(dto: CreateHoraireDto): Promise<HoraireEntity> {
        try {
           
            const existingHoraire = await this.horaireRepository.findOne({
                where: {
                    heureDebut: dto.heureDebut,
                    jour: dto.jour,
                },
            });
    
            if (existingHoraire) {
                throw new ConflictException('Un horaire avec la même heure existe déjà pour ce jour.');
            }
    
            
            const horaire = new HoraireEntity();
            horaire.heureDebut = dto.heureDebut;
            horaire.heureFin = dto.heureFin;
            horaire.jour = dto.jour;
    
            const savedHoraire = await this.horaireRepository.save(horaire);
    
            console.log('in service', savedHoraire);
            return savedHoraire;
        } catch (error) {
            throw new InternalServerErrorException(
                error,
                "Une erreur est survenue lors de la creation de l'horaire.",
            );
        }
    }
    



      async findHoraireById(id: number): Promise<HoraireEntity | undefined> {
        return this.horaireRepository.findOne({ where: { id } });
      }
}
