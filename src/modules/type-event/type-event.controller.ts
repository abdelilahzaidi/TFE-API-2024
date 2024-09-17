import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TypeEventService } from './type-event.service';
import { CreateTypeEventDto } from './dto/create-type.dto';
import { UpdateTypeEventDto } from './dto/update-type.dto';
import { TypeEventI } from './interface/type-event.interface';

@Controller('type-event')
export class TypeEventController {
    constructor(
        private readonly typeEventService: TypeEventService,
    ) {}

    @Get('')
    async all(): Promise<TypeEventI[]> {
        return await this.typeEventService.all();
    }

    // Créer un nouveau type d'événement
    @Post('')
    async create(@Body() createTypeEventDto: CreateTypeEventDto): Promise<TypeEventI> {
        return await this.typeEventService.create(createTypeEventDto);
    }

    // Mettre à jour un type d'événement
    @Put(':id')
    async update(@Param('id') id: number, @Body() updateTypeEventDto: UpdateTypeEventDto): Promise<TypeEventI> {
        return await this.typeEventService.update(id, updateTypeEventDto);
    }

    // Supprimer un type d'événement
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.typeEventService.delete(id);
    }
}
