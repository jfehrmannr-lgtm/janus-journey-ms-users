import { ApiProperty } from '@nestjs/swagger';
import { UserConfigDto } from './user-config.dto.js';

export class UserResponseDto {
  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: UserConfigDto })
  config!: UserConfigDto;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty()
  id!: string;

  @ApiProperty()
  isVerified!: boolean;

  @ApiProperty({ type: Object })
  metadata!: Record<string, unknown>;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: Date;

  @ApiProperty()
  userId!: string;
}
