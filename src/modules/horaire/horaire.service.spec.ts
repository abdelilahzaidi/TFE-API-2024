import { Test, TestingModule } from '@nestjs/testing';
import { HoraireService } from './horaire.service';

describe('HoraireService', () => {
  let service: HoraireService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HoraireService],
    }).compile();

    service = module.get<HoraireService>(HoraireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
