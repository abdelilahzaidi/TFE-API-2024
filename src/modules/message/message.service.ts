import { Body, Get, Injectable, NotFoundException, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { MessageEntity } from './entity/message.entity';
import { CreateMessageDto } from './dto/maessage-create.dto';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageEntity) private messageRepository: Repository<MessageEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
        ) {}
  
        async all():Promise<any[]>{
            return await this.messageRepository.find();
        }
        async createMessage(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
      const { titre, contenu, receivers, senderId } = createMessageDto;
  
   
      const sender = await this.userRepository.findOne({where:{id:senderId}});
  
      if (!sender) {
        throw new NotFoundException(`User with id ${senderId} not found`);
      }
  
  
      const message = this.messageRepository.create({
        titre,
        contenu,
        dateHeureEnvoie :new Date(),
        receivers: receivers.map(receiverId => ({ id: receiverId })),
        sender: sender,
      });
  
      console.log('message : ',message)
      return await this.messageRepository.save(message);
    }

    
 
}
