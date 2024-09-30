import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Param,
  ParseIntPipe,
  NotFoundException,
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


}
