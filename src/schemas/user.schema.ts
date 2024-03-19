import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  const user = this;

  // Hash the password only if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});
