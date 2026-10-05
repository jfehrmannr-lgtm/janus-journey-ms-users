import { describe, expect, it, jest } from '@jest/globals';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  it('delegates User operations to persistence', async () => {
    const repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
    };
    const service = new UsersService(repository);
    const input = { email: 'user@example.com', config: { username: 'user' } };

    await service.create(input);
    await service.findAll({} as never);
    await service.findById('user-id');
    await service.update('user-id', { config: { username: 'updated' } });
    await service.remove('user-id');

    expect(repository.create).toHaveBeenCalledWith(input);
    expect(repository.findAll).toHaveBeenCalledWith({});
    expect(repository.findById).toHaveBeenCalledWith('user-id');
    expect(repository.update).toHaveBeenCalledWith('user-id', {
      config: { username: 'updated' },
    });
    expect(repository.remove).toHaveBeenCalledWith('user-id');
  });
});
