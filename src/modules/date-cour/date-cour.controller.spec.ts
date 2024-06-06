import { Test, TestingModule } from '@nestjs/testing';
import { DateCourController } from './date-cour.controller';

describe('DateCourController', () => {
  let controller: DateCourController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DateCourController],
    }).compile();

    controller = module.get<DateCourController>(DateCourController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
