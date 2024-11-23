import { TrashIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  changeQuantityOfProductInCartApi,
  removeItemInCartApi,
} from '../../api/api';
import { priceSplit } from '../../common/price/priceSplit';
import { IAxiosError } from '../../config/axiosError.interface';
import useToast from '../../hook/useToast';
import { IProductItemMinimal } from '../../interfaces/productItemMinimal.interface';
import { usernameSelector } from '../../store/selector';
import { useAppDispatch } from '../../store/store';
import { removeItemInCartDispatch } from './cartSlice';
import { IProductItem } from '../../interfaces';

type Props = {
  productItem: IProductItem;
  removeItemHandler: Function;
  updateQuantityHandler: Function;
  productSelectHandler: Function;
  idx: number;
  productIndex: number;
};

export const ProductItemInCart = ({
  productItem,
  idx,
  removeItemHandler: updateTotalPriceAndDiscountHandler,
  updateQuantityHandler,
  productSelectHandler,
  productIndex,
}: Props) => {
  const username = useSelector(usernameSelector);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [checked, setChecked] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(productItem.quantity);
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

  const { mutate: removeItemMutate } = useMutation({
    mutationKey: [`removeItem/${username}`],
    mutationFn: removeItemInCartApi,
    onSuccess: () => {
      toast({ type: 'success', message: 'Remove item successfully' });
      dispatch(
        removeItemInCartDispatch({
          productIndex,
          productIdx: idx,
          productId: productItem.uuid,
        })
      );
      updateTotalPriceAndDiscountHandler(
        productItem.price * quantity,
        productItem.discount,
        productItem.uuid
      );
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  const removeItemHandler = () => {
    if (productItem.uuid) {
      removeItemMutate(productItem.uuid);
    }
  };

  useEffect(() => {
    if (updateClick && quantity >= 1 && productItem.uuid) {
      mutate({ productId: productItem.uuid, quantity });
    }
  }, [debounceQuantity]);

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
            checked={checked}
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mr-4'
            onChange={() => {
              setChecked(!checked);
              productSelectHandler(productItem, quantity, !checked);
            }}
          />
        </div>
        <label
          htmlFor={`product-checkbox-${idx}`}
          className='flex items-center hover:cursor-pointer'
        >
          <img
            src={productItem.thumbnailUrl}
            alt={productItem.name}
            className='w-16 h-16 rounded-md mr-4'
          />
          <div>
            <p className='font-semibold line-clamp-3'>{productItem.name}</p>
            <p className='text-gray-500 text-sm'>
              {[productItem.color, productItem.size]
                .filter((el) => !!el)
                .join(',')}
            </p>
          </div>
        </label>
      </div>

      {/* Price Column */}
      <div className='w-1/3 text-center flex gap-2 items-center justify-center'>
        <div className='text-red-500 font-semibold'>
          {priceSplit(productItem.price)}₫
        </div>
        {productItem.discount > 0 && (
          <div className='text-gray-500 line-through text-sm'>
            {priceSplit(productItem.originalPrice)}₫
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
            if (quantity <= 1) {
              setQuantity(1);
            } else {
              setQuantity(quantity - 1);
              if (checked) {
                updateQuantityHandler(
                  productItem.uuid,
                  -1,
                  productItem.price,
                  productItem.discount
                );
              }
            }
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
            if (quantity >= 100) {
              setQuantity(100);
            } else {
              setQuantity(quantity + 1);
              if (checked) {
                updateQuantityHandler(
                  productItem.uuid,
                  1,
                  productItem.price,
                  productItem.discount
                );
              }
            }
            setUpdateClick(true);
          }}
        >
          +
        </button>
      </div>

      {/* Total Price Column */}
      <div className='w-32 text-center'>
        <div className='text-red-500 font-semibold'>
          {priceSplit(productItem.price * quantity)}₫
        </div>
      </div>

      <div
        className='w-8 text-center flex justify-center items-center'
        onClick={removeItemHandler}
      >
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
