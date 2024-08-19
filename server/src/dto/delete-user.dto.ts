import { Expose } from 'class-transformer';

@Expose()
export class DeleteUserDto {
  @Expose()
  id: number;
}
