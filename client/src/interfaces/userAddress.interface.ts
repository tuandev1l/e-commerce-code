export interface IUserAddress {
  uuid: string;
  phoneNumber: string;
  detailAddress: string;
  ward: string;
  district: string;
  province: string;
  country: string;
  isDefault?: boolean;
}
