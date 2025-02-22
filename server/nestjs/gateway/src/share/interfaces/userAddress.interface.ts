export interface IUserAddress {
  uuid?: string;
  detailAddress: string;
  phoneNumber: string;
  ward: string;
  district: string;
  province: string;
  country: string;
  isDefault?: boolean;
}
