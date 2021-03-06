import { AccountStatus } from '../../auth/common/enums/accountStatus.enum';
import { AccountRole } from '../../auth/common/enums/accountRole.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose_delete from 'mongoose-delete';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User &
  Document & {
    validatePassword(password: string): Promise<boolean>;
  };

@Schema({
  timestamps: true,
  autoIndex: true,
  versionKey: false,
  toJSON: {
    transform: function (_, ret, _2) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.activationCode;
      delete ret.activationExpirationDate;
      delete ret.resetPasswordCode;
      delete ret.resetPasswordExpirationDate;
      delete ret.deleted;
      delete ret.delatedAt;
      delete ret.updatedAt;
      delete ret.createdAt;
    },
  },
})
export class User extends Document {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ enum: AccountRole, default: AccountRole.USER })
  role: string;

  @Prop({ enum: AccountStatus, default: AccountStatus.PENDING })
  status: String;

  @Prop({ unique: true, sparse: true })
  activationCode: String;

  @Prop()
  activationExpirationDate: Date;

  @Prop({ unique: true, sparse: true })
  resetPasswordCode: String;

  @Prop()
  resetPasswordExpirationDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.validatePassword = async function (
  this: User,
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

UserSchema.plugin(mongoose_delete, { deletedAt: true, overrideMethods: 'all' });
