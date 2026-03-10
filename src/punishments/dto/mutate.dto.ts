import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePunishmentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  severity?: number;
}

export class DeletePunishmentDto {
  @IsString()
  @IsNotEmpty()
  uuid: string;
}
