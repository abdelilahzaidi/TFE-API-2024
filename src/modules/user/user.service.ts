import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { UserI } from './interface/user.interface';

@Injectable()
export class UserService  {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ) {}

    async all():Promise<UserI[]>{
        console.log('Hello all')
        return await this.userRepository.find()
    }

    async create(data): Promise<UserEntity> {
        return this.userRepository.save(data);
      }
}
