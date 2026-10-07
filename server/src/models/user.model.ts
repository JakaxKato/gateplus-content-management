import { Schema, model, type HydratedDocument } from 'mongoose';

export interface UserDoc {
  name: string;
  email: string;
  password: string;
  role: 'admin';
  created_at: Date;
  updated_at: Date;
}

const userSchema = new Schema<UserDoc>(
  {
    name: {
      type: String,
      required: [true, 'Nama wajib diisi'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email wajib diisi'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password wajib diisi'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  },
);

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const json = ret as unknown as Record<string, unknown>;
    json.id = String(json._id);
    delete json._id;
    delete json.password;
    return json;
  },
});

export type UserDocument = HydratedDocument<UserDoc>;

export const UserModel = model<UserDoc>('User', userSchema);
