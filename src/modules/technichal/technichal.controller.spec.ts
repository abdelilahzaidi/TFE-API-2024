import { Test, TestingModule } from '@nestjs/testing';
import { TechnichalController } from './technichal.controller';

describe('TechnichalController', () => {
  let controller: TechnichalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnichalController],
    }).compile();

    controller = module.get<TechnichalController>(TechnichalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
