import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

import { UserDto, UserInputDto } from './dto';

import { TABLE_NAME } from '../database/database.module';

@Injectable()
export class UsersRepository {
  constructor(private readonly client: AWS.DynamoDB.DocumentClient) {}

  async getAll(): Promise<Array<UserDto>> {
    const result = await this.client.scan({ TableName: TABLE_NAME }).promise();
    return (result.Items as Array<UserDto>);
  }

  async get(id: string): Promise<UserDto> {
    const result = await this.client.get({ TableName: TABLE_NAME, Key: { id } }).promise();
    return (result.Item as UserDto);
  }

  async create(user: UserInputDto): Promise<UserDto> {
    const item = { id: uuid(), ...user }
    await this.client.put({ TableName: TABLE_NAME, Item: item }).promise();
    return item;
  }

  async update(id: string, { name, email }: UserInputDto): Promise<UserDto> {
    const user = await this.get(id);
    if (!user) return user;

    await this.client
      .update({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set #name = :n, #email =:e',
        ExpressionAttributeNames: { '#name': 'name', '#email': 'email' },
        ExpressionAttributeValues:{ ':n': name, ':e': email },
      })
      .promise();

    return { id, name, email };
  }

  async delete(id: string): Promise<UserDto> {
    const user = await this.get(id);
    if (user) await this.client.delete({ TableName: TABLE_NAME, Key: { id } }).promise();
    return user;
  }
}
