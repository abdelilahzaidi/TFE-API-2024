import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TechnichalEntity } from './entity/technichal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TechnichalService {
  constructor(
    @InjectRepository(TechnichalEntity)
    private readonly technichalRepository: Repository<TechnichalEntity>,
  ) {}

  async all(): Promise<any[]> {
    return await this.technichalRepository.find();
  }

  async findById(id:number):Promise<any>{
    return await this.technichalRepository.findOne({where:{id}})
}
}
