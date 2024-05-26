import { Test, TestingModule } from '@nestjs/testing';
import { TechnicalTypeService } from './technical-type.service';

describe('TechnicalTypeService', () => {
  let service: TechnicalTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TechnicalTypeService],
    }).compile();

    service = module.get<TechnicalTypeService>(TechnicalTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
