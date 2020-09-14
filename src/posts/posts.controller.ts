import { Body, Controller, Get, Post, Put, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';

import { PostsService } from './posts.service';

import { PostDto, PostInputDto } from './dto';

@Controller('users/:userId/posts')
export class PostsController {
  constructor(private readonly service: PostsService) {}

  @Get()
  async getUserPosts(@Param('userId') userId: string): Promise<Array<PostDto>> {
    return this.service.getUserPosts(userId);
  }

  @Get(':postId')
  async getById(
    @Param('userId') userId: string, @Param('postId') postId: string,
  ): Promise<PostDto> {
    return this.service.getById(userId, postId);
  }

  @Post()
  async create(
    @Param('userId') userId: string, @Body() dto: PostInputDto,
  ): Promise<PostDto> {
    return this.service.create(userId, dto);
  }

  @Put(':postId')
  async update(
    @Param('userId') userId: string, @Param('postId') postId: string, @Body() dto: PostInputDto,
  ): Promise<PostDto> {
    return this.service.update(userId, postId, dto);
  }

  @Delete(':postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('userId') userId: string, @Param('postId') postId: string,
  ): Promise<void> {
    await this.service.delete(userId, postId);
  }
}
