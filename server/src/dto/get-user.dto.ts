import { Exclude, Expose } from 'class-transformer';

@Expose()
export class GetUserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  surname: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  age: number;

  @Expose()
  country: string;

  @Expose()
  district: string;

  @Expose()
  role: string;

  @Expose()
  createdAt: Date;

  @Exclude()
  password: string;

  @Expose()
  updatedAt: Date;
}
