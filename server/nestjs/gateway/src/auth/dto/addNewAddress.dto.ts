import { IUserAddress } from '@share/interfaces';
import { IsNotEmpty } from 'class-validator';

export class AddNewAddressDto {
  @IsNotEmpty()
  address: IUserAddress;
}
