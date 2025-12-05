import { IsString, IsOptional, IsNumber } from 'class-validator';

export class ProfileDto {
  @IsString()
  displayName: string;

  @IsString()
  gender: string;

  @IsString()
  birthday: string; // Format 'YYYY-MM-DD'

  @IsString()
  horoscope: string;

  @IsString()
  zodiac: string;

  @IsNumber()
  height: number; // dalam cm

  @IsNumber()
  weight: number; // dalam kg

  @IsOptional()
  @IsString()
  profileImage?: string;
}
