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

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService
   
  ) {}

  //List all users
  // @Get()
  // async all(): Promise<UserI[]> {
    
  //   return await this.userService.all();
  // }
  @Get()
  async all(): Promise<UserI[]> {
    const users = await this.userService.all();
    users.forEach(user => {
      // Supprimer les propriétés 
      delete user['password'];
    });
    return users;
  }
  //Get a user by id 
  @Get(':id')
  async getById(@Param('id') id: number): Promise<UserI> {
    const existingUser = await this.userService.findOneById(id);

    if (!existingUser) {
      console.log('id :' + id + " n'existe pas");
      throw new BadRequestException(`User ${id} doesn't exist!`);
    }

    console.log('id :' + id + '  user :' + existingUser.id);
    //delete existingUser['status'];
    delete existingUser['password'];
    return existingUser;
  }
  //Get a user by level
  @Get(':id/level')
  async getUserByLevel(@Param('id', ParseIntPipe) id : number):Promise<UserI | undefined>{
    const user = await this.userService.findOneByLevel(id);
    if(!user){
      throw new BadRequestException(`User ${id} doesn't exist!`)
    }
    return user
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
  async updatePresenceSeance(@Param('id') id: number, @Body() updatePresenceDto: UpdatePresenceDto): Promise<void> {
    const { presence } = updatePresenceDto;
    try {
      await this.userService.updatePresenceSeance(id, presence);
    } catch (error) {
      console.log('error',error)
      throw new HttpException('Error updating SeanceUser presence', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Get(':id/message')
  // async findMessage(@Param('id', ParseIntPipe) id: number): Promise<any> {
  //   const messages = await this.userService.findUserMessagesByUserId(id);
  //   if (!messages) {
  //     throw new BadRequestException(`User ${id} doesn't exist!`);
  //   }
  //   return messages;
  // }
  
}
