import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskModule } from './task/task.module';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';

import mongoConfig from '../mongo.config';

@Module({
  imports: [
    MongooseModule.forRoot(mongoConfig.uri),
    TaskModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
