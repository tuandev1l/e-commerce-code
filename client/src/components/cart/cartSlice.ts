import { createSlice } from '@reduxjs/toolkit';
import { IProductItem } from '../../interfaces';
import { IProductMinimalWrapper } from '../../interfaces/productMinimalWrapper.interface';
import { cartInitalState } from './cartSlice.interface';
import { ICartItemSelect } from './cartItemSelect.interface';

const pickValueOfProduct = (productItem: IProductItem) => ({
  uuid: productItem.uuid,
  color: productItem.color,
  size: productItem.size,
  price: productItem.price,
  quantity: productItem.quantity,
  thumbnailUrl: productItem.thumbnailUrl,
  name: productItem.name,
  originalPrice: productItem.originalPrice,
  discount: productItem.discount,
});

const cartSlice = createSlice({
  name: 'product',
  initialState: cartInitalState,
  reducers: {
    getAllProductsInCart: (state, { payload }) => {
      const {
        productItems,
        total,
        userId,
      }: { productItems: IProductItem[]; total: number; userId: number } =
        payload;
      const data: IProductMinimalWrapper[] = [];
      const cartItemSelect: ICartItemSelect[] = [];
      const sellerObj: { [key: string]: number } = {};
      let discount = 0;
      for (const productItem of productItems) {
        cartItemSelect.push({ ...productItem, select: false });
        if (productItem.seller?.name) {
          const idx = sellerObj[productItem.seller?.name];
          const product = pickValueOfProduct(productItem);
          discount += product.discount * product.quantity;
          if (idx === undefined) {
            sellerObj[productItem.seller.name] = data.length;
            data.push({
              seller: productItem.seller,
              productItem: [product],
            });
          } else {
            data[idx]['productItem'].push(product);
          }
        }
      }

      state.cartItemSelect = cartItemSelect;
      state.products = data;
      state.userId = userId;
      state.discount = discount;
      state.total = total;
    },
  },
  extraReducers: () => {},
});

export const { getAllProductsInCart } = cartSlice.actions;
export default cartSlice;
