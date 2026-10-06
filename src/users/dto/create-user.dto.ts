import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsEmail,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateIf,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { UserConfigDto } from './user-config.dto.js';

export class CreateAuthLoginDto {
  @ApiProperty({ example: 'oauth-google-123456789' })
  @IsString()
  @Length(1, 255)
  authLogin!: string;

  @ApiProperty({ enum: ['platform', 'google', 'github', 'microsoft'] })
  @IsIn(['platform', 'google', 'github', 'microsoft'])
  provider!: 'platform' | 'google' | 'github' | 'microsoft';

  @ApiProperty({ nullable: true, required: false, example: 'user@example.com' })
  @ValidateIf((_, value: unknown) => value !== null && value !== undefined)
  @IsEmail()
  providerEmail?: string | null;

  @ApiProperty({ nullable: true, required: false, example: 'Janus User' })
  @IsOptional()
  @IsString()
  providerUsername?: string | null;

  @ApiProperty({ nullable: true, required: false })
  @ValidateIf((_, value: unknown) => value !== null && value !== undefined)
  @IsUrl({ require_protocol: true })
  providerAvatarUrl?: string | null;

  @ApiProperty({ required: false, type: Object })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Internal Janus identity derived from Better Auth JWT sub.',
  })
  @IsString()
  @Length(1, 255)
  id!: string;

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

  @ApiProperty({ type: CreateAuthLoginDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateAuthLoginDto)
  authLogins!: CreateAuthLoginDto[];
}
