import { Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

import { UserDto, UserInputDto } from './dto';

import { TABLE_NAME_TOKEN } from '../database/database.module';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(TABLE_NAME_TOKEN) private readonly tableName: string,
    private readonly client: AWS.DynamoDB.DocumentClient,
  ) {}

  async getAll(): Promise<Array<UserDto>> {
    const result = await this.client.scan({ TableName: this.tableName }).promise();
    return (result.Items as Array<UserDto>);
  }

  async get(id: string): Promise<UserDto> {
    const { Item } = await this.client
      .get({ TableName: this.tableName, Key: { PK: id, SK: '#PROFILE' } })
      .promise();
    if (!Item) return null;

    const user = new UserDto();
    user.id = id;
    user.name = Item.name;
    user.email = Item.email;

    return user;
  }

  async create(user: UserInputDto): Promise<UserDto> {
    const id = uuid();
    const item = { PK: id, SK: '#PROFILE', type: 'USER', ...user };
    await this.client.put({ TableName: this.tableName, Item: item }).promise();
    return { id, ...user };
  }

  async update(id: string, { name, email }: UserInputDto): Promise<UserDto> {
    const user = await this.get(id);
    if (!user) return user;

    await this.client
      .update({
        TableName: this.tableName,
        Key: { PK: id, SK: '#PROFILE' },
        UpdateExpression: 'set #name = :n, #email =:e',
        ExpressionAttributeNames: { '#name': 'name', '#email': 'email' },
        ExpressionAttributeValues:{ ':n': name, ':e': email },
      })
      .promise();

    return { id, name, email };
  }

  async delete(id: string): Promise<UserDto> {
    const user = await this.get(id);
    if (user) await this.client
      .delete({ TableName: this.tableName, Key: { PK: id, SK: '#PROFILE' } })
      .promise();
    return user;
  }
}
