import { Test, TestingModule } from '@nestjs/testing';
import { LieuController } from './lieu.controller';

describe('LieuController', () => {
  let controller: LieuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LieuController],
    }).compile();

    controller = module.get<LieuController>(LieuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
