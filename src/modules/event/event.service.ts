import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { CreateEventDto } from './dto/event-crete.dto';
import { UpdateEventDto } from './dto/event-update.dto';
import { EventEntity } from './entity/event.entity';

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(EventEntity) private readonly eventRepository: Repository<EventEntity>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
      ) {}
    
      async findAll(): Promise<EventEntity[]> {
        return this.eventRepository.find({ relations: ['users'] });
      }
    
      async create(createEventDto: CreateEventDto): Promise<EventEntity> {
        const { nom, dateDebut, dateFin, userIds } = createEventDto;
    
        const users = await this.userRepository.findByIds(userIds);
        if (users.length !== userIds.length) {
          throw new NotFoundException(`One or more users not found`);
        }
    
        const event = this.eventRepository.create({ nom, dateDebut, dateFin, users });
        return this.eventRepository.save(event);
      }
    
      async update(id: number, updateEventDto: UpdateEventDto): Promise<EventEntity> {
        const { userIds, ...updateData } = updateEventDto;
    
        const event = await this.eventRepository.preload({
          id,
          ...updateData,
        });
    
        if (!event) {
          throw new NotFoundException(`Event with ID ${id} not found`);
        }
    
        if (userIds) {
          const users = await this.userRepository.findByIds(userIds);
          if (users.length !== userIds.length) {
            throw new NotFoundException(`One or more users not found`);
          }
          event.users = users;
        }
    
        return this.eventRepository.save(event);
      }
    
      async delete(id: number): Promise<void> {
        const result = await this.eventRepository.delete(id);
        if (result.affected === 0) {
          throw new NotFoundException(`Event with ID ${id} not found`);
        }
      }
    
      async filterByDate(dateDebut: Date): Promise<EventEntity[]> {
        return this.eventRepository.find({
          where: {
            dateDebut,
          },
          relations: ['users'],
        });
      }
    
      async participateInEvent(eventId: number, userId: number): Promise<void> {
        const event = await this.eventRepository.findOne({ where: { id: eventId }, relations: ['users'] });
        if (!event) {
          throw new NotFoundException(`Event with ID ${eventId} not found`);
        }
    
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
    
        if (event.users.find(u => u.id === user.id)) {
          throw new Error(`User with ID ${userId} is already participating in the event`);
        }
    
        event.users.push(user);
        await this.eventRepository.save(event);
      }
}
