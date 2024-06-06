import { Test, TestingModule } from '@nestjs/testing';
import { CourService } from './cour.service';

describe('CourService', () => {
  let service: CourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourService],
    }).compile();

    service = module.get<CourService>(CourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
