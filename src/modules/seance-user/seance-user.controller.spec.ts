import { Test, TestingModule } from '@nestjs/testing';
import { SeanceUserController } from './seance-user.controller';

describe('SeanceUserController', () => {
  let controller: SeanceUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeanceUserController],
    }).compile();

    controller = module.get<SeanceUserController>(SeanceUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
