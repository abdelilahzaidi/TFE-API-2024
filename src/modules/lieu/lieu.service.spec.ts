import { Test, TestingModule } from '@nestjs/testing';
import { LieuService } from './lieu.service';

describe('LieuService', () => {
  let service: LieuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LieuService],
    }).compile();

    service = module.get<LieuService>(LieuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
