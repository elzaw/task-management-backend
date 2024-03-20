import { HttpException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '../schemas/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create({ userId, ...createTaskDto }: CreateTaskDto): Promise<Task> {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('User Not Found', 404);
    const createdTask = new this.taskModel({ ...createTaskDto, user: userId });
    const savedTask = await createdTask.save();
    await findUser.updateOne({
      $push: {
        tasks: savedTask._id,
      },
    });
    return savedTask;
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async findOne(id: string): Promise<Task | null> {
    return this.taskModel.findById(id).exec();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
    if (!updatedTask) {
      throw new HttpException('Task not found', 404);
    }
    return updatedTask;
  }

  async remove(id: string): Promise<Task | null> {
    const deletedTask = await this.taskModel.findByIdAndDelete(id).exec();
    if (!deletedTask) {
      throw new HttpException('Task not found', 404);
    }
    return deletedTask;
  }

  async findTasksByUser(userId: string): Promise<Task[]> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const tasks = await this.taskModel.find({ user: userId });
    return tasks;
  }
}
