import { Body, Get, HttpException, HttpStatus, Injectable, NotFoundException, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { MessageEntity } from './entity/message.entity';
import { CreateMessageDto } from './dto/maessage-create.dto';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageEntity) private messageRepository: Repository<MessageEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
        ) {}
  
        async all(): Promise<any[]> {
          return await this.messageRepository.find({ select: ['id','sender', 'contenu', 'dateHeureEnvoie'], relations: ['sender'] });
      }
  
      async getMessagesWithUserDetails(): Promise<any[]> {
          const messages = await this.all();
          return messages.map(message => {
              const { sender, contenu, dateHeureEnvoie } = message;
              return {
                  firstName: sender.first_name,
                  lastName: sender.last_name,
                  email: sender.email,
                  content: contenu,
                  sentAt: dateHeureEnvoie,
              };
          });
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

    // async getMessagesBySenders(senderIds: number[]): Promise<MessageEntity[]> {
    //   return await this.messageRepository.find({
    //     where: {
    //       sender: {
    //         id: In(senderIds)
    //       }
    //     },
    //     relations: ['sender', 'receivers'] // Include relations if necessary
    //   });
    // }

    // async getMessagesByReceiver(receiverId: number): Promise<MessageEntity[]> {
    //   return await this.messageRepository.createQueryBuilder('message')
    //     .leftJoinAndSelect('message.receivers', 'receiver')
    //     .where('receiver.id = :receiverId', { receiverId })
    //     .getMany();
    // }

    //Find a message by user
    async findUserByMessageId(id: number): Promise<MessageEntity[]> {
      const messages = await this.messageRepository.find({
        where: { id },
        relations: ['receivers', 'sender'],
      });
  
      if (!messages.length) {
        throw new NotFoundException(`No messages found for user with id ${id}`);
      }
  
      return messages;
    } 
}


