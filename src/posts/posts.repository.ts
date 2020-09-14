import { Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

import { PostDto, PostInputDto } from './dto';

import { TABLE_NAME_TOKEN } from '../database/database.module';

@Injectable()
export class PostsRepository {
  constructor(
    @Inject(TABLE_NAME_TOKEN) private readonly tableName: string,
    private readonly client: AWS.DynamoDB.DocumentClient,
  ) {}

  async getUserPosts(userId: string): Promise<Array<PostDto>> {
    const result = await this.client
      .query({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :PK and begins_with(SK, :POST)',
        ExpressionAttributeValues: { ':PK': userId, ':POST': 'POST' },
      })
      .promise();
    return (result.Items as Array<PostDto>);
  }

  async get(userId: string, postId: string): Promise<PostDto> {
    const { Item } = await this.client
      .get({ TableName: this.tableName, Key: { PK: userId, SK: postId } })
      .promise();
    if (!Item) return null;

    const post = new PostDto();
    post.id = postId;
    post.title = Item.title;
    post.text = Item.text;
    post.addedAt = Item.addedAt;

    return post;
  }

  async create(userId: string, { title, text }: PostInputDto): Promise<PostDto> {
    const postId = `POST${uuid()}`;
    const addedAt = Date.now();

    const item = { PK: userId, SK: postId, title, text, addedAt };
    await this.client.put({ TableName: this.tableName, Item: item }).promise();

    const createdPost = new PostDto();
    createdPost.id = postId;
    createdPost.title = title;
    createdPost.text = text;
    createdPost.addedAt = addedAt;
    return createdPost;
  }

  async update(userId: string, postId: string, { title, text }: PostInputDto): Promise<PostDto> {
    const post = await this.get(userId, postId);
    if (!post) return post;

    await this.client
      .update({
        TableName: this.tableName,
        Key: { PK: userId, SK: postId },
        UpdateExpression: 'set #title = :title, #text =:text',
        ExpressionAttributeNames: { '#title': 'title', '#text': 'text' },
        ExpressionAttributeValues:{ ':title': title, ':text': text },
      })
      .promise();

    post.title = title;
    post.text = text;
    return post;
  }

  async delete(userId: string, postId: string): Promise<PostDto> {
    const post = await this.get(userId, postId);
    if (post) await this.client
      .delete({ TableName: this.tableName, Key: { PK: userId, SK: postId } })
      .promise();
    return post;
  }
}
