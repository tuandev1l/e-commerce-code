import { IsNotEmpty, IsUUID } from 'class-validator';

export class SetDefaultAddressDto {
  @IsNotEmpty()
  @IsUUID()
  addressId: string;
}
