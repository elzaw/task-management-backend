import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Date } from 'mongoose';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @IsString()
  @IsNotEmpty()
  dueDate: Date;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
