import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateCourEntity } from './entity/date.entity';
import { CreateDateCourDTO } from './dto/date-cour-create.dto';
import { startOfYear, endOfYear, addDays } from 'date-fns';

@Injectable()
export class DateCourService {
  constructor(
    @InjectRepository(DateCourEntity)
    private dateCourRepository: Repository<DateCourEntity>,
  ) {}
  //Liste toutes les date de cour
  async all(): Promise<DateCourEntity[]> {
    return await this.dateCourRepository.find();
  }
  //cration de date de cour
  // async createDateCour(dto: CreateDateCourDTO): Promise<DateCourEntity> {
  //   try {
  //     const dateCour = new DateCourEntity();
  //     dateCour.dateCour = dto.dateCour;

  //     const savedDateCour = await this.dateCourRepository.save(dateCour);

  //     console.log('in service', savedDateCour);
  //     return savedDateCour;
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       error,
  //       'Une erreur est survenue lors de la création de la date du cour.',
  //     );
  //   }
  // }
  async findDateCourById(id: number): Promise<DateCourEntity | undefined> {
    return this.dateCourRepository.findOne({ where: { id } });
  }
  // async findDateCourByDate(
  //   dateCour: Date,
  // ): Promise<DateCourEntity | undefined> {
  //   return this.dateCourRepository.findOne({ where: { dateCour } });
  // }



  async findDateCourByDate(
    dateCour: Date,
  ): Promise<DateCourEntity | undefined> {
    return this.dateCourRepository.findOne({ where: { dateCour } });
  }

  private allday(date: Date): boolean {
    const day = date.getDay();
    return day >= 1 && day <= 7; // Matches Monday to Sunday
  }

  private generateDaysOfWeek(year: number): DateCourEntity[] {
    const daysOfWeek: DateCourEntity[] = [];
    const startYear = startOfYear(new Date(year, 0, 1));
    const endYear = endOfYear(new Date(year, 11, 31));

    let currentDate = startYear;

    while (currentDate <= endYear) {
      if (this.allday(currentDate)) {
        const dateCour = new DateCourEntity();
        dateCour.dateCour = currentDate; // Assign the Date object directly
        daysOfWeek.push(dateCour);
      }
      currentDate = addDays(currentDate, 1);
    }

    return daysOfWeek;
  }

  async createDateCourList(year: number): Promise<DateCourEntity[]> {
    try {
      const datesCour = this.generateDaysOfWeek(year);

      const savedDatesCour = await this.dateCourRepository.save(datesCour);

      console.log('Saved datesCour:', savedDatesCour);
      return savedDatesCour;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Une erreur est survenue lors de la création des dates de cours.',
      );
    }
  }
}
