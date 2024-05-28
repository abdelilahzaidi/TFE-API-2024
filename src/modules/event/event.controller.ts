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
}
