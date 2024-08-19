import { IsString, IsEmail, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsInt()
  @Min(1)
  @Max(100)
  age: number;

  @IsString()
  country: string;

  @IsString()
  district: string;

  @IsOptional()
  @IsString()
  role: string;
}
