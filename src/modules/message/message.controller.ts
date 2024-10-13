import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Param,
  ParseIntPipe,
  NotFoundException,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MessageEntity } from './entity/message.entity';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/maessage-create.dto';
import { UserI } from '../user/interface/user.interface';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}


  @Get()
  async all(): Promise<any[]> {
    return await this.messageService.all();
  }

  @Get('/message')
  async getAll() {
    const firstNames = await this.messageService.getMessagesWithUserDetails();
    return firstNames;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.messageService.findOne(id);
  }
  // @Post()
  // async create(
  //   @Body() createMessageDto: CreateMessageDto,
  // ): Promise<MessageEntity> {
  //   console.log('create message', createMessageDto);
  //   return await this.messageService.createMessage(createMessageDto);
  // }

  @Post()
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    try {
      const message = await this.messageService.createMessage(createMessageDto);
      return { message };
    } catch (error) {
      // Gérer les erreurs appropriées ici
      return { error: error.message };
    }
  }

  // @Get(':receiverId')
  // async getMessagesByReceiver(@Param('receiverId') receiverId: number): Promise<MessageEntity[]> {
  //   return this.messageService.getMessagesByReceiver(receiverId);
  // }

  @Get(':id/user')
  async getMessagesByReceiver(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MessageEntity[]> {
    const messages = await this.messageService.findUserByMessageId(id);
    if (!messages) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return messages;
  }
  @Get('user/:id')
  async getMessagesByUserId(@Param('id') id: number){
    const user = await this.messageService.findSentMessagesByUserId(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    console.log('receivers',user)
    return user;
  }


  // // Envoyer un message
  // @Post()
  // async createMessage(@Body() createMessageDto: CreateMessageDto) {
  //   try {
  //     const message = await this.messageService.createMessage(createMessageDto);
  //     return {
  //       statusCode: HttpStatus.CREATED,
  //       message: 'Message successfully created',
  //       data: message,
  //     };
  //   } catch (error) {
  //     throw new HttpException({
  //       statusCode: HttpStatus.BAD_REQUEST,
  //       message: error.message,
  //     }, HttpStatus.BAD_REQUEST);
  //   }
  // }



  // // @Post()
  // // async createMessage(@Body() createMessageDto: CreateMessageDto) {
  // //   const { titre, contenu, senderId, receiverIds } = createMessageDto;
  // //   return this.messageService.createMessage(titre, contenu, senderId, receiverIds);
  // // }

  // // Lister tous les messages reçus par un utilisateur
  // @Get('user/:userId')
  // async getMessagesForUser(@Param('userId') userId: number) {
  //   return this.messageService.getMessagesForUser(userId);
  // }

  // // Supprimer un message
  // @Delete(':messageId')
  // async deleteMessage(@Param('messageId') messageId: number) {
  //   return this.messageService.deleteMessage(messageId);
  // }
  

  // @Get()
  // async all(): Promise<any[]> {
  //   return await this.messageService.all();
  // }

  // // @Get('/message')
  // // async getAll() {
  // //   const firstNames = await this.messageService.getMessagesWithUserDetails();
  // //   return firstNames;
  // // }

  // // @Get(':id')
  // // findOne(@Param('id', ParseIntPipe) id: number) {
  // //   return this.messageService.findOne(id);
  // // }


  // // @Post()
  // // async createMessage(@Body() createMessageDto: CreateMessageDto) {
  // //   try {
  // //     const message = await this.messageService.createMessage(createMessageDto);
  // //     return { message };
  // //   } catch (error) {
  // //     // Gérer les erreurs appropriées ici
  // //     return { error: error.message };
  // //   }
  // // }



  // // @Get(':id/user')
  // // async getMessagesByReceiver(
  // //   @Param('id', ParseIntPipe) id: number,
  // // ): Promise<MessageEntity[]> {
  // //   const messages = await this.messageService.findUserByMessageId(id);
  // //   if (!messages) {
  // //     throw new NotFoundException(`User with id ${id} not found`);
  // //   }
  // //   return messages;
  // // }
  // // @Get('user/:id')
  // // async getMessagesByUserId(@Param('id') id: number){
  // //   //const user = await this.messageService.findSentMessagesByUserId(id);
  // //   const user = await this.messageService.getMessagesByUserId(id);

  // //   if (!user) {
  // //     throw new NotFoundException(`User with ID ${id} not found`);
  // //   }
  // //   console.log('receivers',user)
  // //   return user;
  // // }

  // // Endpoint pour envoyer un message
  // // @Post('send')
  // // async sendMessage(
  // //  @Body() message : CreateMessageDto
  // // ) {
  // //   return this.messageService.sendMessage(message);
  // // }

  // // // Endpoint pour lister tous les messages
  // // @Get()
  // // async findAll() {
  // //   return this.messageService.findAll();
  // // }

  // // // Endpoint pour lister les messages reçus par un utilisateur
  // // @Get('received/:userId')
  // // async findReceivedMessages(@Param('userId') userId: number) {
  // //   return this.messageService.findReceivedMessages(userId);
  // // }

  // // // Endpoint pour lister les messages envoyés par un utilisateur
  // // @Get('sent/:userId')
  // // async findSentMessages(@Param('userId') userId: number) {
  // //   return this.messageService.findSentMessages(userId);
  // // }

  // // // Endpoint pour lister les messages (envoyés et reçus) par utilisateur
  // // @Get('user/:userId')
  // // async findMessagesByUser(@Param('userId') userId: number) {
  // //   return this.messageService.findMessagesByUser(userId);
  // // }
  





}
