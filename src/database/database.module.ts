import { Inject, Injectable, Module, OnModuleInit } from '@nestjs/common';
import * as AWS from 'aws-sdk';

const TABLE_NAME_VALUE = 'Main';
export const TABLE_NAME_TOKEN = 'table-name-token';

@Injectable()
@Module({
  providers: [
    AWS.DynamoDB,
    AWS.DynamoDB.DocumentClient,
    { provide: TABLE_NAME_TOKEN, useValue: TABLE_NAME_VALUE },
  ],
  exports: [AWS.DynamoDB, AWS.DynamoDB.DocumentClient, TABLE_NAME_TOKEN]
})
export class DatabaseModule implements OnModuleInit {
  constructor(
    @Inject(TABLE_NAME_TOKEN) private readonly tableName: string,
    private readonly db: AWS.DynamoDB,
  ) {}


  async onModuleInit(): Promise<void> {
    const result = await this.db.listTables().promise();
    if (result.TableNames.includes(this.tableName)) return;

    await this.db.createTable({
      TableName: this.tableName,
      KeySchema: [
        { AttributeName: 'PK', KeyType: 'HASH' },
        { AttributeName: 'SK', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'PK', AttributeType: 'S' },
        { AttributeName: 'SK', AttributeType: 'S' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      },
    }).promise();
  }
}
