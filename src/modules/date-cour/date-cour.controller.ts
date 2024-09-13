import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DateCourService } from './date-cour.service';
import { CreateDateCourDTO } from './dto/date-cour-create.dto';
import { DateCourEntity } from './entity/date.entity';

@Controller('date-cour')
export class DateCourController {
  constructor(private readonly dateCourService: DateCourService) {}

  @Get()
  async all(): Promise<DateCourEntity[]> {
    return await this.dateCourService.all();
  }
  // @Post()
  // async create(@Body() dto: CreateDateCourDTO): Promise<DateCourEntity> {
  //   console.log(dto);
  //   return await this.dateCourService.createDateCour(dto);
  // }


  @Post('create/:year')
  async createDateCour(@Param('year') year: number): Promise<DateCourEntity[]> {
    return await this.dateCourService.createDateCourList(year);
  }

  @Get(':id')
  async getDateById(@Param('id') date: Date) {
    return this.dateCourService.findDateCourByDate(date);
  }
}
