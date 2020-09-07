import { Injectable, Module, Global, OnModuleInit } from '@nestjs/common';
import * as AWS from 'aws-sdk';

export const TABLE_NAME = 'Main';

@Injectable()
@Global()
@Module({
  providers: [AWS.DynamoDB, AWS.DynamoDB.DocumentClient],
  exports: [AWS.DynamoDB, AWS.DynamoDB.DocumentClient]
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly db: AWS.DynamoDB) {}


  async onModuleInit(): Promise<void> {
    const result = await this.db.listTables().promise();
    if (result.TableNames.includes(TABLE_NAME)) return;

    await this.db.createTable({
      TableName: TABLE_NAME,
      KeySchema: [{ AttributeName: 'id', KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      },
    }).promise();
  }
}
