import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBrandWithoutId {
  @IsNotEmpty()
  @IsString()
  name: string;
}
