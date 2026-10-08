import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { FindUsersQueryDto } from '../dto/find-users-query.dto.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';
import { UserDocument, UserSchema } from '../schemas/user.schema.js';
import type { User } from '../types/user.types.js';
import type { CollectionResult } from '@common/collection-result.js';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(input: CreateUserDto): Promise<User> {
    const now = new Date();

    try {
      const user = await this.userModel.create({
        authLogins: input.authLogins.map((authLogin) => ({
          ...authLogin,
          createdAt: now,
          lastLoginAt: now,
          metadata: authLogin.metadata ?? {},
          providerEmail: authLogin.providerEmail ?? null,
          providerUsername: authLogin.providerUsername ?? null,
          providerAvatarUrl: authLogin.providerAvatarUrl ?? null,
        })),
        config: input.config,
        email: input.email,
        id: input.id,
        isVerified: false,
        metadata: input.metadata ?? {},
        userId: `user-${randomUUID()}`,
      });

      return this.toUser(user);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        throw new ConflictException(
          'The User violates a uniqueness constraint',
        );
      }

      throw error;
    }
  }

  async findAll(query: FindUsersQueryDto): Promise<CollectionResult<User>> {
    const filter: Record<string, unknown> = {};

    if (query.email !== undefined) filter.email = query.email;
    if (query.isVerified !== undefined) filter.isVerified = query.isVerified;
    if (query.userId !== undefined) filter.userId = query.userId;
    if (query.username !== undefined)
      filter['config.username'] = query.username;

    const [documents, totalRecords] = await Promise.all([
      this.userModel
        .find(filter)
        .sort({ [query.sortBy]: query.sortOrder === 'desc' ? -1 : 1 })
        .skip((query.page - 1) * query.size)
        .limit(query.size)
        .lean<UserSchema[]>()
        .exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    return {
      items: documents.map((document) => this.toUser(document)),
      totalRecords,
    };
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ id }).lean<UserSchema>().exec();

    if (!user) {
      throw new NotFoundException(`User ${id} was not found`);
    }

    return this.toUser(user);
  }

  async update(id: string, input: UpdateUserDto): Promise<User> {
    const update: Record<string, unknown> = {};

    if (input.config?.username !== undefined) {
      update['config.username'] = input.config.username;
    }

    if (input.config?.avatarUrl !== undefined) {
      update['config.avatarUrl'] = input.config.avatarUrl;
    }

    const user = await this.userModel
      .findOneAndUpdate(
        { id },
        { $set: update },
        { returnDocument: 'after', runValidators: true },
      )
      .lean<UserSchema>()
      .exec();

    if (!user) {
      throw new NotFoundException(`User ${id} was not found`);
    }

    return this.toUser(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`User ${id} was not found`);
    }
  }

  private toUser(document: UserSchema): User {
    return {
      authLogins: document.authLogins ?? [],
      config: document.config,
      createdAt: document.createdAt,
      email: document.email,
      id: document.id,
      isVerified: document.isVerified,
      metadata: document.metadata ?? {},
      updatedAt: document.updatedAt,
      userId: document.userId,
    };
  }
}
