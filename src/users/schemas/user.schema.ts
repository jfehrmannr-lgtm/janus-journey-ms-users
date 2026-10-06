import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { AuthLogin, UserConfig } from '../types/user.types.js';

export type UserDocument = HydratedDocument<UserSchema>;

@Schema({ _id: false })
export class UserConfigSchema implements UserConfig {
  @Prop({ default: null, type: String })
  avatarUrl!: string | null;

  @Prop({ required: true, type: String })
  username!: string;
}

@Schema({ _id: false })
export class AuthLoginSchema implements AuthLogin {
  @Prop({ required: true, type: String })
  authLogin!: string;

  @Prop({ required: true, type: Date })
  createdAt!: Date;

  @Prop({ required: true, type: Date })
  lastLoginAt!: Date;

  @Prop({ type: Object })
  metadata!: Record<string, unknown>;

  @Prop({
    required: true,
    type: String,
    enum: ['platform', 'google', 'github', 'microsoft'],
  })
  provider!: AuthLogin['provider'];

  @Prop({ default: null, type: String })
  providerAvatarUrl!: string | null;

  @Prop({ default: null, type: String })
  providerEmail!: string | null;

  @Prop({ default: null, type: String })
  providerUsername!: string | null;
}

@Schema({ collection: 'users', timestamps: true, versionKey: false })
export class UserSchema {
  @Prop({ default: [], type: [AuthLoginSchema] })
  authLogins!: AuthLoginSchema[];

  @Prop({ required: true, type: UserConfigSchema })
  config!: UserConfigSchema;

  @Prop({ required: true, unique: true, type: String })
  email!: string;

  @Prop({ required: true, unique: true, type: String })
  id!: string;

  @Prop({ default: false, type: Boolean })
  isVerified!: boolean;

  @Prop({ default: {}, type: Object })
  metadata!: Record<string, unknown>;

  createdAt!: Date;

  updatedAt!: Date;

  @Prop({ required: true, unique: true, type: String })
  userId!: string;
}

export const UserSchemaDefinition = SchemaFactory.createForClass(UserSchema);
UserSchemaDefinition.index({ 'config.username': 1 });
UserSchemaDefinition.index({ isVerified: 1 });
UserSchemaDefinition.index({ 'authLogins.authLogin': 1 }, { unique: true });
