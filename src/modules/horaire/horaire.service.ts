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
          // Vérifiez d'abord s'il existe déjà un horaire avec la même heure pour le même jour
          const existingHoraire = await this.horaireRepository.findOne({
            where: {
              heureDebut: new Date(`0001-01-01T${dto.heureDebut}:00.000`),
              jour: dto.jour,
            },
          });
    
          if (existingHoraire) {
            throw new ConflictException('Un horaire avec la même heure existe déjà pour ce jour.');
          }
    
          // Si aucun horaire existant n'a été trouvé, créez un nouvel horaire
          const horaire = new HoraireEntity();
          horaire.heureDebut = new Date(`0001-01-01T${dto.heureDebut}:00.000`);
          horaire.heureFin = new Date(`0001-01-01T${dto.heureFin}:00.000`);
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
