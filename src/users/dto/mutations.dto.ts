import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class CheckOldPasswordDto {
  @IsString()
  oldPassword: string;
}

export class ChangePasswordDto {
  @IsString()
  newPassword: string;
}
