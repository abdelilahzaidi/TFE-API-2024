import { Test, TestingModule } from '@nestjs/testing';
import { TechnichalService } from './technichal.service';

describe('TechnichalService', () => {
  let service: TechnichalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TechnichalService],
    }).compile();

    service = module.get<TechnichalService>(TechnichalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
