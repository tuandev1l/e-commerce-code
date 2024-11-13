import { IProductMinimalWrapper } from '../../interfaces/productMinimalWrapper.interface';
import { ProductItemInCart } from './ProductItemInCart';

type Props = {
  product: IProductMinimalWrapper;
  productIndex: number;
  removeItemHandler: Function;
  updateQuantityHandler: Function;
  productSelectHandler: Function;
  productCheckHandler: Function;
};

export const ProductInCart = ({
  product,
  productIndex,
  updateQuantityHandler,
  productSelectHandler,
  removeItemHandler,
}: Props) => {
  return (
    <div key={productIndex} className='bg-white p-4 pb-2 mb-4 rounded-lg'>
      {/* Seller Row */}
      <div className='flex items-center border-b pb-2 mb-2'>
        <h3 className='font-semibold'>{product.seller?.name}</h3>
      </div>

      {product.productItem.map((productItem, idx) => (
        <ProductItemInCart
          removeItemHandler={removeItemHandler}
          key={productItem.uuid}
          productIndex={productIndex}
          productItem={productItem}
          idx={idx}
          productSelectHandler={productSelectHandler}
          updateQuantityHandler={updateQuantityHandler}
        />
      ))}
    </div>
  );
};
