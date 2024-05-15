import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserI } from './interface/user.interface';
import { UserCreateDTO } from './dto/user-create.dto';
import { UserUpdateDTO } from './dto/user-update.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //List all users
  @Get()
  async all(): Promise<UserI[]> {
    return await this.userService.all();
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
    return await this.userService.findOneById(id);
  }
  //create a user
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
}
