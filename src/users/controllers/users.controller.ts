import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { FindUsersQueryDto } from '../dto/find-users-query.dto.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';
import { UserResponseDto } from '../dto/user-response.dto.js';
import { UsersService } from '../services/users.service.js';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a User' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  @Post()
  create(@Body() input: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(input);
  }

  @ApiOperation({ summary: 'List Users' })
  @ApiResponse({ isArray: true, status: 200, type: UserResponseDto })
  @Get()
  findAll(@Query() query: FindUsersQueryDto): Promise<UserResponseDto[]> {
    return this.usersService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a User by ID' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @Get(':id')
  findById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: 'Update a User by ID' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() input: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, input);
  }

  @ApiOperation({ summary: 'Delete a User by ID' })
  @ApiNoContentResponse({ description: 'User deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}
