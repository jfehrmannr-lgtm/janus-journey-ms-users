import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { UserConfigDto } from './user-config.dto.js';

export class CreateUserDto {
  @ApiProperty({ type: UserConfigDto })
  @ValidateNested()
  @Type(() => UserConfigDto)
  config!: UserConfigDto;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ required: false, type: Object })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
