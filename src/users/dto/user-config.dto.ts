import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UserConfigDto {
  @ApiProperty({ nullable: true, type: String })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  avatarUrl?: string | null;

  @ApiProperty({ example: 'johann' })
  @IsString()
  @Length(1, 100)
  username!: string;
}
