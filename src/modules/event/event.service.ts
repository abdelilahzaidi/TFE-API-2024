import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { CreateEventDto } from './dto/event-create.dto';
import { UpdateEventDto } from './dto/event-update.dto';
import { EventEntity } from './entity/event.entity';
import { TypeEventEntity } from '../type-event/entity/type-event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TypeEventEntity)
    private readonly typeEventRepository: Repository<TypeEventEntity>,
  ) {}

  async findAll(): Promise<EventEntity[]> {
    return this.eventRepository.find();
  }

  async findUsersByEvent(): Promise<EventEntity[]> {
    return this.eventRepository.find({ relations: ['users'] });
  }

  async findEventById(id: number): Promise<EventEntity> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      console.log('Event not found with ID:', id);
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event; 
  }

  async create(createEventDto: CreateEventDto): Promise<EventEntity> {
    const event = this.eventRepository.create(createEventDto);

    
    const typeEvent = await this.typeEventRepository.findOne({
      where: { id: createEventDto.typeEventId },
    });
    console.log('Eventsss',event)
    if (!typeEvent) {
      throw new NotFoundException(`Type d'événement avec l'ID ${createEventDto.typeEventId} non trouvé`);
    }

    
    event.typeEvents = typeEvent;

    
    return await this.eventRepository.save(event);
  }



  async update(
    id: number,
    updateEventDto: UpdateEventDto,
  ): Promise<EventEntity> {
    const { userIds, dateDebut, dateFin, ...updateData } = updateEventDto;

    console.log('Date de début reçue :', dateDebut);
    console.log('Date de fin reçue :', dateFin);

    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    
    event.nom = updateData.nom;
    event.dateDebut = dateDebut;
    event.dateFin = dateFin;

    
    return this.eventRepository.save(event);
  }

  async delete(id: number): Promise<any> {
    const event = await this.eventRepository.findOne({ where: { id } });
    const result = await this.eventRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Return a success message
    return `Event ${event.nom} is deleted!!!`;
  }

  async filterByDate(dateDebut: Date): Promise<EventEntity[]> {
    return this.eventRepository.find({
      where: {
        dateDebut,
      },
      relations: ['users'],
    });
  }

 
  async participateInEvent(eventId: number, userId: number): Promise<string> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['users'],
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const existingUserIndex = event.users.findIndex((u) => u.id === user.id);
    if (existingUserIndex !== -1) {
      
      event.users.splice(existingUserIndex, 1);
      await this.eventRepository.save(event);
      return `You have successfully removed your participation from the event ${event.nom}`;
    } else {
      
      event.users.push(user);
      await this.eventRepository.save(event);
      return `You are now participating in the event ${event.nom}`;
    }
  }

  async getEventParticipants(eventId: number): Promise<any[] | undefined> {
    
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.users', 'user_event')
      .where('event.id = :eventId', { eventId })
      .getOne();
  
    
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
  
    
    const users = event.users ? event.users : [];

    if(users.length === 0){
      throw new NotFoundException(`No participants for event with ${eventId}`)
    }
    
    
    console.log('Event:', event);
  
    return users;
  }
}
