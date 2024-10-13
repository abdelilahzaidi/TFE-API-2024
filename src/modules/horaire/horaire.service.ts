import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DayOfWeek, HoraireEntity } from './entity/horaire.entity';
import { CreateHoraireDto } from './dto/horaire-create.dto';
import { UpdateHoraireDto } from './dto/horaire-update.dto';

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

        // Mettre à jour un horaire
  async update(id: number, updateHoraireDto: UpdateHoraireDto): Promise<HoraireEntity> {
    const horaire = await this.horaireRepository.findOne({where:{id}});

    Object.assign(horaire, updateHoraireDto);

    return this.horaireRepository.save(horaire);
  }

  // Supprimer un horaire
  async remove(id: number): Promise<void> {
    const horaire = await this.horaireRepository.findOne({where:{id}});
    await this.horaireRepository.remove(horaire);
  }




  //Generer des horaires automatiquement
   // Méthode pour générer automatiquement une plage horaire
   async generateHorairesForDay(day: DayOfWeek): Promise<HoraireEntity[]> {
    const horaires: HoraireEntity[] = [];
    
    for (let hour = 0; hour < 24; hour++) {
      const heureDebut = `${hour.toString().padStart(2, '0')}:00`;
      const heureFin = `${((hour + 2) % 24).toString().padStart(2, '0')}:00`;

      const horaire = this.horaireRepository.create({
        heureDebut,
        heureFin,
        jour: day,
      });

      horaires.push(horaire);
    }

    return this.horaireRepository.save(horaires);
  }

  // Exemple de génération pour toute la semaine
  async generateHorairesForWeek(): Promise<void> {
    const daysOfWeek: DayOfWeek[] = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    
    for (const day of daysOfWeek) {
      await this.generateHorairesForDay(day);
    }
  }
}
