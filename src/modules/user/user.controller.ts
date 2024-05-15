import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserI } from './interface/user.interface';
import { UserCreateDTO } from './dto/user-create.dto';

@Controller('user')
export class UserController {
    constructor(
        private userService : UserService
    ){}


    @Get()
    async all():Promise<UserI[]>{
        return await this.userService.all();
    }

    @Post()
    async createUser(@Body() dto : UserCreateDTO):Promise<UserI>{        
        console.log('DTO in controler ',dto)
       return  await this.userService.create(dto);
    }
}
