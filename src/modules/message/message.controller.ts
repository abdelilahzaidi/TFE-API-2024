import { Body, Controller, Post,Get, Query, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { MessageEntity } from './entity/message.entity';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/maessage-create.dto';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Get()
    async all():Promise<any[]>{
        return await this.messageService.all();
    }




    @Get('/user')
    async getAll() {
        const firstNames = await this.messageService.getMessagesWithUserDetails();
        return firstNames;
    }
    @Post()
    async create(@Body() createMessageDto: CreateMessageDto): Promise<MessageEntity> {
      console.log("create message",createMessageDto)
      return await this.messageService.createMessage(createMessageDto);
    }
  
    // @Get(':receiverId')
    // async getMessagesByReceiver(@Param('receiverId') receiverId: number): Promise<MessageEntity[]> {
    //   return this.messageService.getMessagesByReceiver(receiverId);
    // }

    @Get(':id/user')
  async getMessagesByReceiver(@Param('id', ParseIntPipe) id: number): Promise<MessageEntity[]> {
    const messages = await this.messageService.findUserByMessageId(id);
    if (!messages) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return messages;
  }
}
