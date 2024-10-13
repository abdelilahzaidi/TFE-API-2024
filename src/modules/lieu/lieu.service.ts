import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLieuDto } from './dto/lieu-create.dto';
import { LieuEntity } from './entity/lieu.entity';
import { UpdateLieuDto } from './dto/lieu-update.dto';

@Injectable()
export class LieuService {
  constructor(
    @InjectRepository(LieuEntity)
    private readonly lieuRepository: Repository<LieuEntity>,
  ) {}

  async all(): Promise<LieuEntity[]> {
    return await this.lieuRepository.find();
  }

  async createLieu(dto: CreateLieuDto): Promise<LieuEntity> {
    try {
      const lieu = new LieuEntity();
      lieu.rue = dto.rue;
      lieu.commune = dto.commune;
      lieu.ville = dto.ville;

      const savedLieu = await this.lieuRepository.save(lieu);

      console.log('in service', savedLieu);
      return savedLieu;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Une erreur est survenue lors de la création du lieu.',
      );
    }
  }
  async findLieuById(id: number): Promise<LieuEntity | undefined> {
    return this.lieuRepository.findOne({ where: { id } });
  }
  async update(id: number, updateLieuDto: UpdateLieuDto): Promise<LieuEntity> {
    const result = await this.lieuRepository.update(id, updateLieuDto);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Lieu with ID ${id} not found`);
    }
  
    return await this.lieuRepository.findOne({ where: { id } });
  }
  
}
