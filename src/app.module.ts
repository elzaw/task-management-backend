import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskModule } from './task/task.module';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';

require('dotenv').config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.URI),
    TaskModule,
    UsersModule,
    AuthModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
