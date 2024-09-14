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
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<EventEntity[]> {
    return this.eventRepository.find({ relations: ['users'] });
  }

  async findEventById(id: number): Promise<EventEntity> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      console.log('Event not found with ID:', id);
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event; // Retourne directement l'événement trouvé, pas dans un tableau
  }

  async create(createEventDto: CreateEventDto): Promise<EventEntity> {
    const { nom, dateDebut, dateFin, userIds } = createEventDto;

    const users = await this.userRepository.findByIds(userIds);
    if (users.length !== userIds.length) {
      throw new NotFoundException(`One or more users not found`);
    }

    const event = this.eventRepository.create({ nom, dateDebut, dateFin });
    return this.eventRepository.save(event);
  }

  // async update(id: number, updateEventDto: UpdateEventDto): Promise<EventEntity> {
  //   const { userIds, ...updateData } = updateEventDto;

  //   const event = await this.eventRepository.findOne({ where: { id } });
  //   console.log('event ',event)
  //   if (!event) {
  //     throw new NotFoundException(`Event with ID ${id} not found`);
  //   }

  //   if (userIds) {
  //     const users = await this.userRepository.findByIds(userIds);
  //     if (users.length !== userIds.length) {
  //       throw new NotFoundException(`One or more users not found`);
  //     }
  //     event.users = users;
  //   }

  //   console.log('Date de début reçue :', updateData.dateDebut);
  //   console.log('Date de fin reçue :', updateData.dateFin);

  //   event.nom = updateData.nom;
  //   event.dateDebut = updateData.dateDebut;
  //   event.dateFin = updateData.dateFin;

  //   return this.eventRepository.save(event);
  // }

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

    // Mettre à jour les champs de l'événement
    event.nom = updateData.nom;
    event.dateDebut = dateDebut;
    event.dateFin = dateFin;

    // Enregistrer et retourner l'événement mis à jour
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

  // async participateInEvent(eventId: number, userId: number): Promise<void> {
  //   const event = await this.eventRepository.findOne({ where: { id: eventId }, relations: ['users'] });
  //   if (!event) {
  //     throw new NotFoundException(`Event with ID ${eventId} not found`);
  //   }

  //   const user = await this.userRepository.findOne({ where: { id: userId } });
  //   if (!user) {
  //     throw new NotFoundException(`User with ID ${userId} not found`);
  //   }

  //   if (event.users.find(u => u.id === user.id)) {
  //     throw new Error(`User with ID ${userId} is already participating in the event`);
  //   }

  //   event.users.push(user);
  //   await this.eventRepository.save(event);
  // }
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
      // User is already participating, remove from the event
      event.users.splice(existingUserIndex, 1);
      await this.eventRepository.save(event);
      return `You have successfully removed your participation from the event ${event.nom}`;
    } else {
      // User is not participating, add to the event
      event.users.push(user);
      await this.eventRepository.save(event);
      return `You are now participating in the event ${event.nom}`;
    }
  }

  async getEventParticipants(eventId: number): Promise<any[] | undefined> {
    // Fetch the event along with its users
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.users', 'user_event')
      .where('event.id = :eventId', { eventId })
      .getOne();
  
    // If the event is not found, throw a NotFoundException
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
  
    // If users exist, return them; otherwise, return an empty array
    const users = event.users ? event.users : [];

    if(users.length === 0){
      throw new NotFoundException(`No participants for event with ${eventId}`)
    }
    
    // Log the event details (for debugging purposes)
    console.log('Event:', event);
  
    return users;
  }
}
