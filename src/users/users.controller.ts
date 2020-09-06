import { Body, Controller, Get, Post, Put, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';

import { UsersService } from './users.service';

import { UserDto, UserInputDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async getAll(): Promise<Array<UserDto>> {
    return this.service.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserDto> {
    return this.service.getById(id);
  }

  @Post()
  async create(@Body() dto: UserInputDto): Promise<UserDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UserInputDto): Promise<UserDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.service.delete(id);
  }
}
