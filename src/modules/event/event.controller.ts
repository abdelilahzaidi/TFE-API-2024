import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateEventDto } from './dto/event-crete.dto';
import { UpdateEventDto } from './dto/event-update.dto';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) {}

  @Get()
  async findAll() {
    return this.eventService.findAll();
  }

  @Get('users')
  async findUsersByEvnts(): Promise<any[]> {
    const events = await this.eventService.findUsersByEvent();

  // Use map to return a new array of events with users, but without passwords
  const eventsWithoutPasswords = events.map(event => {
    // For each event, map through the users and remove the password field from each user
    const usersWithoutPasswords = event.users.map(user => {
      const { password, ...userWithoutPassword } = user;  // Remove password from each user
      return userWithoutPassword;
    });

    // Return event object with users without passwords
    return { ...event, users: usersWithoutPasswords };
  });

  return eventsWithoutPasswords;  
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.eventService.findEventById(id);
  }

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.eventService.delete(id);
  }

  @Get('filter/date')
  async filterByDate(@Query('dateDebut') dateDebut: Date) {
    return this.eventService.filterByDate(dateDebut);
  }

  @Post(':id/participate')
  async participate(@Param('id') eventId: number, @Body('userId') userId: number) {
    return this.eventService.participateInEvent(eventId, userId);
  }
  @Get(':id/participants')
  async getUserByEvent(@Param('id') eventId: number){
    return this.eventService.getEventParticipants(eventId)
  }
}
