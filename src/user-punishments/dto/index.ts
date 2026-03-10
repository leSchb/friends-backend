import { IsNotEmpty, IsString } from 'class-validator';

export class CompletePunishmentDto {
  @IsString()
  @IsNotEmpty()
  uuid: string;
}
