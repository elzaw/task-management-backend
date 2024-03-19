import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: Date.now })
  dueDate: Date;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ required: true })
  category: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
