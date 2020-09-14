import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { PostsModule } from './posts/posts.module';

@Module({ imports: [UsersModule, DatabaseModule, PostsModule] })
export class AppModule {}
