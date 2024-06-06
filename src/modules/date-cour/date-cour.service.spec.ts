import { Test, TestingModule } from '@nestjs/testing';
import { DateCourService } from './date-cour.service';

describe('DateCourService', () => {
  let service: DateCourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateCourService],
    }).compile();

    service = module.get<DateCourService>(DateCourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
