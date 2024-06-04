import { Test, TestingModule } from '@nestjs/testing';
import { TypeAbonnementService } from './type-abonnement.service';

describe('TypeAbonnementService', () => {
  let service: TypeAbonnementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeAbonnementService],
    }).compile();

    service = module.get<TypeAbonnementService>(TypeAbonnementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
