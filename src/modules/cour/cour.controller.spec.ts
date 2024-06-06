import { Test, TestingModule } from '@nestjs/testing';
import { CourController } from './cour.controller';

describe('CourController', () => {
  let controller: CourController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourController],
    }).compile();

    controller = module.get<CourController>(CourController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
