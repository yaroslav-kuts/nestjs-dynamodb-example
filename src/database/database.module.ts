import { Module, Global } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Global()
@Module({
  providers: [AWS.DynamoDB, AWS.DynamoDB.DocumentClient],
  exports: [AWS.DynamoDB, AWS.DynamoDB.DocumentClient]
})
export class DatabaseModule {}
