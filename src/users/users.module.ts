import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './controllers/users.controller.js';
import { UsersRepository } from './repositories/users.repository.js';
import { UserSchema, UserSchemaDefinition } from './schemas/user.schema.js';
import { UsersService } from './services/users.service.js';

@Module({
  controllers: [UsersController],
  imports: [
    MongooseModule.forFeature([
      { name: UserSchema.name, schema: UserSchemaDefinition },
    ]),
  ],
  providers: [UsersRepository, UsersService],
})
export class UsersModule {}
