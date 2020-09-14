import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository]
})
export class PostsModule {}
