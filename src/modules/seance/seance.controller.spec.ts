import { Test, TestingModule } from '@nestjs/testing';
import { SeanceController } from './seance.controller';

describe('SeanceController', () => {
  let controller: SeanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeanceController],
    }).compile();

    controller = module.get<SeanceController>(SeanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
