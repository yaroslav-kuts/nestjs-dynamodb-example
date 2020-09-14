import { Injectable, NotFoundException } from '@nestjs/common';

import { PostsRepository } from './posts.repository';

import { PostDto, PostInputDto } from './dto';

@Injectable()
export class PostsService {
  constructor(private readonly repository: PostsRepository) {}

  async getUserPosts(userId: string): Promise<Array<PostDto>> {
    return this.repository.getUserPosts(userId);
  }

  async getById(userId: string, postId: string): Promise<PostDto> {
    const post = await this.repository.get(userId, postId);
    if (!post) throw new NotFoundException();
    return post;
  }

  async create(userId: string, post: PostInputDto): Promise<PostDto> {
    return this.repository.create(userId, post);
  }

  async update(userId: string, postId: string, userInput: PostInputDto): Promise<PostDto> {
    const post = await this.repository.update(userId, postId, userInput);
    if (!post) throw new NotFoundException();
    return post;
  }

  async delete(userId: string, postId: string): Promise<void> {
    const post = await this.repository.delete(userId, postId);
    if (!post) throw new NotFoundException();
  }
}
