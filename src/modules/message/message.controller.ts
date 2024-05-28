import { Body, Controller, Post,Get } from '@nestjs/common';
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
    @Post()
    async create(@Body() createMessageDto: CreateMessageDto): Promise<MessageEntity> {
      console.log("create message",createMessageDto)
      return await this.messageService.createMessage(createMessageDto);
    }
}
