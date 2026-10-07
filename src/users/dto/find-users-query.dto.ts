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
  IsDefined,
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

  @ApiPropertyOptional({ type: Number, minimum: 1, maximum: 200, default: 20 })
  @IsDefined()
  @IsInt()
  @Max(200)
  @Min(1)
  @Type(() => Number)
  size!: number;

  @ApiPropertyOptional({ type: Number, minimum: 1, default: 1 })
  @IsDefined()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page!: number;

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
