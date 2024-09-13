import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserI } from './interface/user.interface';
import { UserCreateDTO } from './dto/user-create.dto';
import { UserStatus } from 'src/common/enums/status.enum';
import { Status } from 'src/common/decorators/status.decorator';
import { StatusGuard } from 'src/common/guards/status.guards';
import { UpdatePresenceDto } from './dto/user-seance-update.dto';
import { SentMessages } from './interface/user-sent-message.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  //List of users
  @Get()
  async all(): Promise<UserI[]> {
    const users = await this.userService.all();
    users.forEach((user) => {
      // Supprimer la propriété password
      delete user['password']; 
      delete user['level'];     
    });
    console.log("All users : ",users)
    return users;
  }
  //Get a user by id
  @Get(':id')
  async getUserById(@Param('id') id: number) {
    const existingUser = await this.userService.findOneById(id);

    if (!existingUser) {
      throw new BadRequestException(`User ${id} doesn't exist!`);
    }
    
    delete existingUser['password']
    delete existingUser['level']
    
    return existingUser;
  }


    //Get a user by level
    @Get(':id')
    async getById(@Param('id') id: number) {
      const existingUser = await this.userService.findOneByLevel(id)
  
      if (!existingUser) {
        throw new BadRequestException(`User ${id} doesn't exist!`);
      }
      
      delete existingUser['password']
      
      return existingUser;
    }



  //Get a user by level
  @Get(':id/level')
  async getUserByLevel(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserI | undefined> {
    const user = await this.userService.findOneByLevel(id);
    if (!user) {
      throw new BadRequestException(`User ${id} doesn't exist!`);
    }
    delete user['password']
    return user;
  }
  //create a user
  // @UseGuards(StatusGuard)
  // @Status(UserStatus.ADMIN)
  @Post()
  async createUser(@Body() dto: UserCreateDTO): Promise<UserI> {
    console.log('DTO in controler ', dto);
    const existingEmail = await this.userService.findOneByEmail(dto.email);
    if (existingEmail) {
      throw new BadRequestException('Email already exists!!');
    }
    return await this.userService.create(dto);
  }
  //Delete a user
  @UseGuards(StatusGuard)
  @Status(UserStatus.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<UserI> {
    const existingUser = await this.userService.findOneById(id);
    if (!existingUser) {
      console.log('id :' + id + " n'existe pas");
      throw new BadRequestException(
        `User ${id} doesn't exist! You can't delete this user!!`,
      );
    }
    console.log('User de id :' + id + '  est supprimmé :' + existingUser.id);
    return await this.userService.delete(id);
  }

  //Update a user
  @UseGuards(StatusGuard)
  @Status(UserStatus.ADMIN)
  @Put(':id')
  async put(@Param('id') id: number, @Body() body): Promise<UserI> {
    const { ...data } = body;
    const existingUser = await this.userService.findOneById(id);
    if (!existingUser) {
      console.log('id :' + id + " n'existe pas");
      throw new BadRequestException(
        `User ${id} doesn't exist! You can't update this user!!`,
      );
    }
    console.log(
      'User de id :' + id + '  a étét modifié avec succès :' + existingUser.id,
    );
    return await this.userService.update(id, { ...data });
  }

  @Put(':id/presence')
  async updatePresenceSeance(
    @Param('id') id: number,
    @Body() updatePresenceDto: UpdatePresenceDto,
  ): Promise<void> {
    const { presence } = updatePresenceDto;
    try {
      await this.userService.updatePresenceSeance(id, presence);
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        'Error updating SeanceUser presence',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Get(':id/message')
  // async findMessage(@Param('id', ParseIntPipe) id: number): Promise<any> {
  //   const messages = await this.userService.findUserByMessageId(id);
  //   if (!messages) {
  //     throw new BadRequestException(`User ${id} doesn't exist!`);
  //   }
  //   return messages;
  // }



  @Get(':id/message')
  async findMessage(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const messages = await this.userService.findMessageByUserById(id);
    if (!messages) {
      throw new BadRequestException(`User ${id} doesn't exist!`);
    }
    return messages;
  }


  //message par emetteur
  @Get(':id/sent-messages')
  async getSentMessages(@Param('id') id: number): Promise<SentMessages> {
    return this.userService.findSentMessagesByUserId(id);
  }

  //Part Reset
  @Post('request-reset-password')
  async requestResetPassword(@Body('email') email: string) {
    return this.userService.requestResetPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Body('token') token: string, @Body('newPassword') newPassword: string) {
    return this.userService.resetPassword(token, newPassword);
  }
}
