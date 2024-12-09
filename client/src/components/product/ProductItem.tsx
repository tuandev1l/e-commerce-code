import { useLocation } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import { priceSplit } from '../../common/price/priceSplit';
import { IProduct } from '../../interfaces';

type Props = {
  product: IProduct;
};

export const ProductItem = ({ product }: Props) => {
  const isMainPage = useLocation().pathname === '/';

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm p-6 hover:cursor-pointer`}
      onClick={() =>
        (document.location.href = `/product/${product._id ?? product.id}`)
      }
    >
      <div className={`${isMainPage ? 'h-56 w-full' : 'h-40 w-full'}`}>
        <img className='mx-auto h-full ' src={product.thumbnailUrl} alt='' />
      </div>
      <div className='pt-2'>
        <div className='mb-2 flex items-center justify-between gap-4'></div>
        <p
          className={`font-bold leading-tight text-gray-900 mb-2 flex items-center ${
            isMainPage ? 'text-xl' : 'text-lg'
          }`}
        >
          {`${priceSplit(product.price)} đ`}
          {product.discountRate !== 0 && (
            <span className='px-2.5 py-0.5 rounded-xl bg-gray-200 ml-2 text-sm'>{`-${product.discountRate}%`}</span>
          )}
        </p>
        <div className='font-semibold leading-tight text-gray-900 hover:underline line-clamp-3 min-h-14'>
          {product.name}
        </div>

        <div
          className={`flex items-center gap-2 mt-2 ${
            !isMainPage && '-m-4 mt-2 justify-center'
          }`}
        >
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
          <p className={`text-sm font-medium text-gray-500`}>
            {`Đã bán ${product.quantitySold?.value ?? 0}`}
          </p>
          {/* {isMainPage && (

            )} */}
        </div>
      </div>
      {/* <button
        type='button'
        className='flex items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 font-medium w-full gap-2 bg-gray-100 mt-2 hover:bg-gray-300'
      >
        <ShoppingCartIcon width={24} />
        Add to cart
      </button> */}
    </div>
  );
};
