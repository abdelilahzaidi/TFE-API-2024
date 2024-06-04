import { Test, TestingModule } from '@nestjs/testing';
import { TypeAbonnementController } from './type-abonnement.controller';

describe('TypeAbonnementController', () => {
  let controller: TypeAbonnementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeAbonnementController],
    }).compile();

    controller = module.get<TypeAbonnementController>(TypeAbonnementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
