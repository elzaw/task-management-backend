import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '../schemas/task.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
