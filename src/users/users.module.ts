import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository  } from './users.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository]
})
export class UsersModule {}
