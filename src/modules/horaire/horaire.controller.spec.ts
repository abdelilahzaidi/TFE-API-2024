import { Test, TestingModule } from '@nestjs/testing';
import { HoraireController } from './horaire.controller';

describe('HoraireController', () => {
  let controller: HoraireController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HoraireController],
    }).compile();

    controller = module.get<HoraireController>(HoraireController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
