import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class FindUsersQueryDto {
  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => value === 'true')
  isVerified?: boolean;

  @ApiPropertyOptional({ type: Number, default: 10, minimum: 1, maximum: 100 })
  @IsInt()
  @IsOptional()
  @Max(100)
  @Min(1)
  @Type(() => Number)
  limit = 10;

  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'asc' })
  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder: 'asc' | 'desc' = 'asc';

  @ApiPropertyOptional({
    enum: ['createdAt', 'updatedAt', 'userId', 'email'],
    default: 'createdAt',
  })
  @IsIn(['createdAt', 'updatedAt', 'userId', 'email'])
  @IsOptional()
  sortBy: 'createdAt' | 'updatedAt' | 'userId' | 'email' = 'createdAt';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;
}
