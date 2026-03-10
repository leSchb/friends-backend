import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePunishmentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsOptional()
  severity?: number;
}
