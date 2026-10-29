import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { FindUsersQueryDto } from '../dto/find-users-query.dto.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';
import { UsersRepository } from '../repositories/users.repository.js';
import type { User } from '../types/user.types.js';
import type { CollectionResult } from '@common/collection-result.js';

const MAX_PAGE_SIZE = 200;

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(input: CreateUserDto): Promise<User> {
    return this.usersRepository.create(input);
  }

  findAll(
    query: FindUsersQueryDto,
    ownerId: string,
  ): Promise<CollectionResult<User>> {
    return this.usersRepository.findAll({
      ...query,
      size: Math.min(query.size, MAX_PAGE_SIZE),
      ownerId,
    });
  }

  findById(id: string, ownerId: string): Promise<User> {
    return this.usersRepository.findById(id, ownerId);
  }

  update(id: string, input: UpdateUserDto, ownerId: string): Promise<User> {
    return this.usersRepository.update(id, input, ownerId);
  }

  remove(id: string, ownerId: string): Promise<void> {
    return this.usersRepository.remove(id, ownerId);
  }
}
