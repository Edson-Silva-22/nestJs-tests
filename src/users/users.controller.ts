import { Controller, Get, Post, Body, Param, Delete, Res, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
    const result = await this.usersService.create(createUserDto);
    return response.status(result.status).json(result)
  }

  @Get()
  async findAll(@Res() response: Response) {
    const result = await this.usersService.findAll();
    return response.status(result.status).json(result)
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    const result = await this.usersService.findOne(id);
    return response.status(result.status).json(result)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() response: Response) {
    const result = await this.usersService.update(id, updateUserDto);
    return response.status(result.status).json(result)
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response) {
    const result = await this.usersService.remove(id);
    return response.status(result.status).json(result)
  }
}
