import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskModule } from './task/task.module';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';

require('dotenv').config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.URI),
    TaskModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
