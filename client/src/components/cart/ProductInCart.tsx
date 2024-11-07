import { useEffect, useState } from 'react';
import { IProductMinimalWrapper } from '../../interfaces/productMinimalWrapper.interface';
import { ProductItemInCart } from './ProductItemInCart';

type Props = {
  product: IProductMinimalWrapper;
  productIndex: number;
  updateQuantityHandler: Function;
  productSelectHandler: Function;
  productCheckHandler: Function;
  checkedValue: boolean;
};

export const ProductInCart = ({
  product,
  productIndex,
  updateQuantityHandler,
  productSelectHandler,
  productCheckHandler,
  checkedValue,
}: Props) => {
  const [checked, setChecked] = useState<boolean>(checkedValue);
  const productItemLength = product.productItem.length;
  const [productItemCheckStatus, setProductItemCheckStatus] = useState<
    boolean[]
  >(new Array(productItemLength).fill(checkedValue));
  const [productItemQuantities, setProductItemQuantities] = useState<number[]>(
    product.productItem.map((pdItem) => pdItem.quantity)
  );

  const productItemQuantityHandler = (idx: number, amount: number) => {
    productItemQuantities[idx] += amount;
    if (productItemCheckStatus[idx]) {
      const productItem = product.productItem[idx];
      amount > 0
        ? updateQuantityHandler(productItem.price, productItem.discount)
        : updateQuantityHandler(-productItem.price, -productItem.discount);
    }
    setProductItemQuantities([...productItemQuantities]);
  };

  const productItemCheckHandler = (idx: number) => {
    productItemCheckStatus[idx] = !productItemCheckStatus[idx];
    setProductItemCheckStatus([...productItemCheckStatus]);
  };

  useEffect(() => {
    setProductItemCheckStatus(new Array(productItemLength).fill(checkedValue));
  }, [checkedValue]);

  useEffect(() => {
    setChecked(productItemCheckStatus.every((el) => !!el));
    // const productElSelectedIdx = productItemCheckStatus.filter(
    //   (status, idx) => {
    //     if (status) {
    //       return idx;
    //     }
    //   }
    // );
    // productElSelectedIdx.forEach((idx) => {
    //   console.log(`Idx Item selected: ${idx}`);
    // });
  }, [productItemCheckStatus]);

  return (
    <div key={productIndex} className='bg-white p-4 pb-2 mb-4 rounded-lg'>
      {/* Seller Row */}
      <div className='flex items-center border-b pb-2 mb-2'>
        <input
          id={`seller-checkbox-${productIndex}`}
          type='checkbox'
          checked={checked}
          onChange={() => {
            setProductItemCheckStatus(
              new Array(productItemLength).fill(checked ? false : true)
            );
            productCheckHandler(productIndex);
          }}
          className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-4'
        />
        <h3 className='font-semibold'>{product.seller?.name}</h3>
      </div>

      {product.productItem.map((productItem, idx) => (
        <ProductItemInCart
          key={productItem.uuid}
          productItem={productItem}
          idx={idx}
          quantity={productItemQuantities[idx]}
          productItemQuantityHandler={productItemQuantityHandler}
          // productSelectHandler={productSelectHandler}
          updateQuantityHandler={updateQuantityHandler}
          checkedValue={productItemCheckStatus[idx]}
          productItemCheckHandler={productItemCheckHandler}
        />
      ))}
    </div>
  );
};
