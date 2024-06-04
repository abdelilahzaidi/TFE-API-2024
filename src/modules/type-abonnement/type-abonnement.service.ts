import { Injectable } from '@nestjs/common';
import { TypeAbonnementEntity } from './entity/type-abonnement';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TypeAbonnementService {
    constructor(
        @InjectRepository(TypeAbonnementEntity)
        private readonly typeAbonnementRepository : Repository<TypeAbonnementEntity>
    ){}

    async all():Promise<any[]>{
        return await this.typeAbonnementRepository.find()
    }
    async findUsersByType(id: number): Promise<any> {
        const typeAbonnement = await this.typeAbonnementRepository.findOne({
          where: { id }, 
                 
          relations: [ 'abonnements.user'],
        });
    
        if (!typeAbonnement) {
          throw new Error(`Type d'abonnement avec ID ${id} non trouvé.`);
        }
    
        const abonnements = typeAbonnement.abonnements;
        const users = abonnements.map(abonnement => ({
            first_name: abonnement.user.first_name,
            last_name: abonnement.user.last_name,
            email: abonnement.user.email,
        }));
    
        return { typeAbonnement, users };
      }
}
