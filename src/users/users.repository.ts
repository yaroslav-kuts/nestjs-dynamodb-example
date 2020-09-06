import { Injectable, OnModuleInit } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

import { UserDto, UserInputDto } from './dto';

@Injectable()
export class UsersRepository implements OnModuleInit {
  private readonly table = 'users';

  constructor(
    private readonly db: AWS.DynamoDB,
    private readonly client: AWS.DynamoDB.DocumentClient,
  ) {}


  async onModuleInit(): Promise<void> {
    const result = await this.db.listTables().promise();
    if (result.TableNames.includes(this.table)) return;

    await this.db.createTable({
      TableName : this.table,
      KeySchema: [{ AttributeName: 'id', KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      },
    }).promise();
  }

  async getAll(): Promise<Array<UserDto>> {
    const result = await this.client.scan({ TableName: this.table }).promise();
    return (result.Items as Array<UserDto>);
  }

  async get(id: string): Promise<UserDto> {
    const result = await this.client.get({ TableName: this.table, Key: { id } }).promise();
    return (result.Item as UserDto);
  }

  async create(user: UserInputDto): Promise<UserDto> {
    const item = { id: uuid(), ...user }
    await this.client.put({ TableName: this.table, Item: item }).promise();
    return item;
  }

  async update(id: string, { name, email }: UserInputDto): Promise<UserDto> {
    const user = await this.get(id);
    if (!user) return user;

    await this.client
      .update({
        TableName: this.table,
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
    if (user) await this.client.delete({ TableName: this.table, Key: { id } }).promise();
    return user;
  }
}
