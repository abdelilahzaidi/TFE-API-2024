import { Body, Get, HttpException, HttpStatus, Injectable, NotFoundException, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { MessageEntity } from './entity/message.entity';
import { CreateMessageDto } from './dto/maessage-create.dto';
import { classToPlain } from 'class-transformer';
import { UserI } from '../user/interface/user.interface';
import { SentMessages } from '../user/interface/user-sent-message.interface';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageEntity) private messageRepository: Repository<MessageEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
        ) {}
  
        async all(): Promise<any[]> {
          return await this.messageRepository.find({ select: ['id','titre','sender', 'contenu', 'dateHeureEnvoie'], relations: ['sender'] });
      }


      async findOne(id: number) {
        const message = this.messageRepository.findOne({where:{id}});
        if (!message) {
          throw new NotFoundException(`Message with ID ${id} not found`);
        }
        return await message;
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
        try {
            const { titre, contenu, senderId, receiverIds } = createMessageDto;
    
            
            const sender = await this.userRepository.findOne({ where: { id: senderId }});
            if (!sender) {
                throw new NotFoundException(`Sender with ID ${senderId} not found`);
            }
    
           
            const receivers = await this.userRepository.findByIds(receiverIds);
            if (receivers.length !== receiverIds.length) {
                throw new NotFoundException('One or more receivers not found');
            }
    
            
            const message = this.messageRepository.create({
                titre,
                contenu,
                dateHeureEnvoie: new Date(),
                sender,
                receivers
            });
    
            
            return await this.messageRepository.save(message);
    
        } catch (error) {
            console.error('Error:', error);
            throw new Error(`Could not create message: ${error.message}`);
        }
    }


 
    
      

   

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
    async getMessagesByUserId(userId: number): Promise<UserEntity> {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.receivedMessages', 'receivedMessages')
        .leftJoinAndSelect('receivedMessages.receivers', 'receivers')
        .leftJoinAndSelect('user.sentMessages', 'sentMessages')
        .leftJoinAndSelect('sentMessages.sender', 'sender')
        .where('user.id = :userId', { userId })
        .getOne();
  
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
  
     
      user.receivedMessages.forEach(message => {
        message.receivers.forEach(receiver => delete receiver.password);
      });
  
      return user;
    }

    async getUserWithSentMessages(userId: number): Promise<UserI | undefined> {
      return await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.sentMessages', 'sentMessages')
        .leftJoinAndSelect('user.receiver', 'receiver') 
        .where('user.id = :userId', { userId })
        .getOne();
    }

    async findSentMessagesByUserId(id: number): Promise<SentMessages> {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['sentMessages.sender', 'sentMessages.receivers'],
      });
    
      if (!user) {
        throw new NotFoundException(`No user found with id ${id}`);
      }
    
      const sentMessages: SentMessages = {
        sender: {
          firstName: user.first_name,
          lastName: user.last_name,
        },
        sentMessages: user.sentMessages.map(message => ({
          id: message.id,
          titre:message.titre,
          content: message.contenu, 
          dateHeureEnvoie : message.dateHeureEnvoie,
          receivers: message.receivers.map(receiver => ({
            id: receiver.id,
            firstName: receiver.first_name,
            lastName: receiver.last_name,
          })),
        })),
      };
    
      return sentMessages;
    }

    

}


