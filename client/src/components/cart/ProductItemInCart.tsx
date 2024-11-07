import { TrashIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';
import { changeQuantityOfProductInCartApi } from '../../api/api';
import { IAxiosError } from '../../config/axiosError.interface';
import useToast from '../../hook/useToast';
import { IProductItemMinimal } from '../../interfaces/productItemMinimal.interface';

type Props = {
  productItem: IProductItemMinimal;
  idx: number;
  quantity: number;
  productItemQuantityHandler: Function;
  updateQuantityHandler: Function;
  productItemCheckHandler: Function;
  checkedValue: boolean;
};

export const ProductItemInCart = ({
  productItem,
  idx,
  quantity,
  productItemQuantityHandler,
  updateQuantityHandler,
  productItemCheckHandler,
  checkedValue,
}: Props) => {
  const toast = useToast();
  const [updateClick, setUpdateClick] = useState<boolean>(false);
  const debounceQuantity = useDebounce(quantity, 1000);

  const { mutate } = useMutation({
    mutationKey: [`changeQuantity/${productItem.uuid}`],
    mutationFn: changeQuantityOfProductInCartApi,
    onSuccess: () => {
      toast({
        type: 'success',
        message: 'Change quantity product successfully',
      });
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  // useEffect(() => {
  //   if (updateClick && quantity >= 1 && productItem.uuid) {
  //     mutate({ productId: productItem.uuid, quantity });
  //   }
  // }, [debounceQuantity]);

  return (
    <div
      key={productItem.uuid}
      className='flex justify-between items-center py-1 mb-4'
    >
      {/* Checkbox and Image */}
      <div className='flex items-center w-1/2'>
        <div>
          <input
            id={`product-checkbox-${idx}`}
            type='checkbox'
            checked={checkedValue}
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mr-4'
            onChange={() => {
              productItemCheckHandler(idx);
            }}
          />
        </div>
        <img
          src={productItem.thumbnailUrl}
          alt={productItem.name}
          className='w-16 h-16 rounded-md mr-4'
        />
        <div>
          <p className='font-semibold line-clamp-3'>{productItem.name}</p>
          <p className='text-gray-500 text-sm'>
            {productItem.color}, {productItem.size}
          </p>
        </div>
      </div>

      {/* Price Column */}
      <div className='w-1/3 text-center flex gap-2 items-center justify-center'>
        <div className='text-red-500 font-semibold'>
          {productItem.price.toLocaleString()}₫
        </div>
        {productItem.discount > 0 && (
          <div className='text-gray-500 line-through text-sm'>
            {productItem.originalPrice.toLocaleString()}₫
          </div>
        )}
      </div>

      {/* Quantity Column */}
      <div className='w-32 text-center flex items-center justify-center'>
        <button
          className={`px-2 border ${
            quantity <= 1 && 'hover:cursor-disabled bg-gray-100'
          }`}
          onClick={() => {
            productItemQuantityHandler(idx, -1);
            // if (quantity <= 1) {
            //   setQuantity(1);
            // } else {
            //   setQuantity(quantity - 1);
            //   if (checkedValue) {
            //     updateQuantityHandler(
            //       -productItem.price,
            //       -productItem.discount
            //     );
            //   }
            // }
            setUpdateClick(true);
          }}
        >
          -
        </button>
        <span className='mx-2'>{quantity}</span>
        <button
          className={`px-2 border ${
            quantity >= 100 && 'hover:cursor-disabled bg-gray-100'
          }`}
          onClick={() => {
            productItemQuantityHandler(idx, 1);
            // if (quantity >= 100) {
            //   setQuantity(100);
            // } else {
            //   setQuantity(quantity + 1);
            //   if (checkedValue) {
            //     updateQuantityHandler(productItem.price, productItem.discount);
            //   }
            // }
            setUpdateClick(true);
          }}
        >
          +
        </button>
      </div>

      {/* Total Price Column */}
      <div className='w-32 text-center'>
        <div className='text-red-500 font-semibold'>
          {(productItem.price * quantity).toLocaleString()}₫
        </div>
      </div>

      <div className='w-8 text-center flex justify-center items-center'>
        <TrashIcon
          width={24}
          className='text-gray-500 hover:text-red-500 cursor-pointer'
        />
      </div>
    </div>
  );
};

/**
 * 3 checked => checked
 * 1-2 unchecked => unchecked
 * checked => 3 checked
 * unchecked => 3 unchecked
 */
