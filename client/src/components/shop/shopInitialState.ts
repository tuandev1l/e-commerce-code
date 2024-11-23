import { IProductItem, IShop } from '../../interfaces';

export interface IShopSlice {
  isLoading: boolean;
  products: IProductItem[];
  shop: IShop;
  error: string;
}

export const shopInitialState: IShopSlice = {
  isLoading: false,
  products: [],
  shop: {
    _id: '0',
    name: '',
    url: '',
    address: {
      country: 'Viet Nam',
      detailAddress: '',
      district: '',
      phoneNumber: '',
      province: '',
      uuid: '',
      ward: '',
      isDefault: false,
    },
  },
  error: '',
};
