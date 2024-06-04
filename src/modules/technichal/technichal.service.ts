import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TechnichalEntity } from './entity/technichal.entity';
import { In, Repository } from 'typeorm';
import { TechnichalTypeEntity } from '../technical-type/entity/technical-type.entity';

@Injectable()
export class TechnichalService {
  constructor(
    @InjectRepository(TechnichalEntity)
    private readonly technichalRepository: Repository<TechnichalEntity>,

    
  ) {}

  async all(): Promise<any[]> {
    return await this.technichalRepository.find({relations:['technichalType']});
  }

  async findById(id:number):Promise<any>{
    return await this.technichalRepository.findOne({where:{id}})
}
// async findAllByIds(ids: number[]): Promise<any[]> {
//   return await this.technichalRepository.findBy({ id: In(ids) });
// }
async findAllByIds(ids: number[]): Promise<any[]> {
  return await this.technichalRepository.createQueryBuilder('technical')
      .whereInIds(ids)
      .getMany();
}



}
