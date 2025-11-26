import { IsOptional, IsBoolean, IsString, MinLength } from 'class-validator';

export class UserDto {
  @IsString()
  @MinLength(3)
  name: string;

  id: number;

  // @IsOptional()
  age?: number;

  @IsBoolean()
  @IsOptional()
  admin?: boolean;
}
