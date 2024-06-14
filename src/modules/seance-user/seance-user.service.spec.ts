import { Test, TestingModule } from '@nestjs/testing';
import { SeanceUserService } from './seance-user.service';

describe('SeanceUserService', () => {
  let service: SeanceUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeanceUserService],
    }).compile();

    service = module.get<SeanceUserService>(SeanceUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
