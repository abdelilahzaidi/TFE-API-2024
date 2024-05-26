import { Test, TestingModule } from '@nestjs/testing';
import { TechnicalTypeController } from './technical-type.controller';

describe('TechnicalTypeController', () => {
  let controller: TechnicalTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnicalTypeController],
    }).compile();

    controller = module.get<TechnicalTypeController>(TechnicalTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
