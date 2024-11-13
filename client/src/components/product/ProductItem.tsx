import { Link } from 'react-router-dom';
import { IProduct } from '../../interfaces';
import { Rating } from 'react-simple-star-rating';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { priceSplit } from '../../common/price/priceSplit';

type Props = {
  product: IProduct;
};

export const ProductItem = ({ product }: Props) => {
  return (
    <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm '>
      <Link to={`/product/${product._id}`}>
        <div className='h-56 w-full'>
          <img
            className='mx-auto h-full '
            src={product.images[0].baseUrl}
            alt=''
          />
        </div>
        <div className='pt-6'>
          <div className='mb-4 flex items-center justify-between gap-4'></div>
          <p className='text-xl font-bold leading-tight text-gray-900 mb-2 flex items-center'>
            {`${priceSplit(product.price)} đ`}
            {product.discountRate !== 0 && (
              <span className='px-2.5 py-0.5 rounded-xl bg-gray-200 ml-2 text-sm'>{`-${product.discountRate}%`}</span>
            )}
          </p>
          <div className='font-semibold leading-tight text-gray-900 hover:underline line-clamp-3 min-h-14'>
            {product.name}
          </div>

          <div className='mt-2 flex items-center gap-2 items-center'>
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
              {`Đã bán ${product.quantitySold?.value}`}
            </p>
          </div>
        </div>
      </Link>
      <button
        type='button'
        className='flex items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 font-medium w-full gap-2 bg-gray-100 mt-2 hover:bg-gray-300'
      >
        <ShoppingCartIcon width={24} />
        Add to cart
      </button>
    </div>
  );
};
