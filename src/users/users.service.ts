import { Injectable, NotFoundException } from '@nestjs/common';

import { UsersRepository } from './users.repository';

import { UserDto, UserInputDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async getAll(): Promise<Array<UserDto>> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<UserDto> {
    const user = await this.repository.get(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  async create(user: UserInputDto): Promise<UserDto> {
    return this.repository.create(user);
  }

  async update(id: string, userInput: UserInputDto): Promise<UserDto> {
    const user = await this.repository.update(id, userInput);
    if (!user) throw new NotFoundException();
    return user;
  }

  async delete(id: string): Promise<void> {
    const user = await this.repository.delete(id);
    if (!user) throw new NotFoundException();
  }
}
