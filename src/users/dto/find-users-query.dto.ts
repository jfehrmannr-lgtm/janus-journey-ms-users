import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
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
  @Transform(({ value }: { value: unknown }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  isVerified?: boolean;

  @ApiPropertyOptional({
    description:
      'Requested page size. Values above 200 are accepted and normalized to 200.',
    type: 'integer',
    minimum: 1,
    default: 20,
  })
  @IsDefined()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  size!: number;

  @ApiPropertyOptional({ type: 'integer', minimum: 1, default: 1 })
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
