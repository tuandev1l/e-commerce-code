import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryDtoWithoutId {
  @IsNotEmpty()
  @IsString()
  name: string;
}
