import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { FindUsersQueryDto } from '../dto/find-users-query.dto.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';
import { UsersRepository } from '../repositories/users.repository.js';
import type { User } from '../types/user.types.js';
import type { CollectionResult } from '@common/collection-result.js';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(input: CreateUserDto): Promise<User> {
    return this.usersRepository.create(input);
  }

  findAll(query: FindUsersQueryDto): Promise<CollectionResult<User>> {
    return this.usersRepository.findAll(query);
  }

  findById(id: string): Promise<User> {
    return this.usersRepository.findById(id);
  }

  update(id: string, input: UpdateUserDto): Promise<User> {
    return this.usersRepository.update(id, input);
  }

  remove(id: string): Promise<void> {
    return this.usersRepository.remove(id);
  }
}
