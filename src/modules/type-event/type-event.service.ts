import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeEventEntity } from './entity/type-event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTypeEventDto } from './dto/create-type.dto';
import { UpdateTypeEventDto } from './dto/update-type.dto';

@Injectable()
export class TypeEventService {
    constructor(
        @InjectRepository(TypeEventEntity)
        private readonly typeRepository: Repository<TypeEventEntity>,
      ) {}
    
      // Récupérer tous les types d'événements
      async all(): Promise<TypeEventEntity[]> {
        return await this.typeRepository.find();
      }
    
      // Créer un nouveau type d'événement
      async create(typeEventDto: CreateTypeEventDto): Promise<TypeEventEntity> {
        const newTypeEvent = this.typeRepository.create(typeEventDto);
        return await this.typeRepository.save(newTypeEvent);  
      }
    
      // Mettre à jour un type d'événement
      async update(
        id: number,
        updateTypeEventDto: UpdateTypeEventDto,
      ): Promise<TypeEventEntity> {
        await this.typeRepository.update(id, updateTypeEventDto);
        return await this.typeRepository.findOne({ where: { id } });
      }
    
      // Supprimer un type d'événement
      async delete(id: number): Promise<void> {
        await this.typeRepository.delete(id);
      }
}
