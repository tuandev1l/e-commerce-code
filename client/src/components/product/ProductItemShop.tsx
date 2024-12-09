import { Link, useParams } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import { priceSplit } from '../../common/price/priceSplit';
import useToast from '../../hook/useToast';
import { IProduct } from '../../interfaces';
import { useMutation } from '@tanstack/react-query';
import { backToSellApi, deleteProductApi } from '../../api/api';
import { IAxiosError } from '../../config/axiosError.interface';

type Props = {
  product: IProduct;
  deleteProduct: Function;
};

export const ProductItemShop = ({ product, deleteProduct }: Props) => {
  const shopId = useParams()['shopId'];
  const toast = useToast();

  const { mutate } = useMutation({
    mutationKey: [`deleteProduct/${product._id}`],
    mutationFn: deleteProductApi,
    onSuccess: () => {
      toast({ type: 'success', message: 'Stop selling product successfully' });
      deleteProduct(product._id, 'DELETE');
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  const deleteProductHandler = () => {
    if (product._id && confirm('Are you sure about that?')) {
      mutate(product._id);
    }
  };

  const { mutate: backToSellMutate } = useMutation({
    mutationKey: [`backToSell/${product._id}`],
    mutationFn: backToSellApi,
    onSuccess: () => {
      toast({ type: 'success', message: 'Back to sell successfully' });
      deleteProduct(product._id, 'BACK');
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  const backToSellHandler = () => {
    if (confirm('Are you sure about that?')) {
      backToSellMutate(product._id);
    }
  };

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm '>
      <Link to={`/product/${product._id ?? product.id}`}>
        <div className='h-56 w-full'>
          <img className='mx-auto h-full ' src={product.thumbnailUrl} alt='' />
        </div>
        <div className='pt-2'>
          <div className='mb-2 flex items-center justify-between gap-4'></div>
          <p className='text-xl font-bold leading-tight text-gray-900 mb-2 flex items-center'>
            {`${priceSplit(product.price)} đ`}
            {product.discountRate !== 0 && (
              <span className='px-2.5 py-0.5 rounded-xl bg-gray-200 ml-2 text-sm'>{`-${product.discountRate}%`}</span>
            )}
          </p>
          <div className='font-semibold leading-tight text-gray-900 hover:underline line-clamp-3 min-h-14'>
            {product.name}
          </div>

          <div className='flex items-center gap-2 items-center'>
            <div>
              <Rating
                size={16}
                readonly
                transition
                allowFraction
                initialValue={product.ratingAverage}
                SVGclassName={'inline-block'}
              />
            </div>
            <p className='text-sm font-medium text-gray-900 '>
              {product.ratingAverage}
            </p>
            <p className='text-sm font-medium text-gray-500 '>
              {`Đã bán ${product.quantitySold?.value ?? 0}`}
            </p>
          </div>
        </div>
      </Link>
      {!product.stopSelling ? (
        <div className='flex gap-2'>
          <div className='w-full'>
            <button
              type='button'
              className='flex items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 font-medium gap-2 bg-blue-600 mt-2 hover:bg-blue-700 text-white w-full'
              onClick={() =>
                toast({
                  type: 'success',
                  message: 'Sử dụng Postman để demo thay thế chức năng này',
                })
              }
            >
              Update
            </button>
          </div>
          <button
            type='button'
            className='flex items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 font-medium gap-2 bg-red-600 mt-2 hover:bg-red-700 text-white w-full'
            onClick={deleteProductHandler}
          >
            Stop selling
          </button>
        </div>
      ) : (
        <div className='w-full'>
          <button
            type='button'
            className='flex items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 font-medium gap-2 bg-blue-600 mt-2 hover:bg-gray-300 text-white w-full'
            onClick={backToSellHandler}
          >
            Back to sell
          </button>
        </div>
      )}
    </div>
  );
};
