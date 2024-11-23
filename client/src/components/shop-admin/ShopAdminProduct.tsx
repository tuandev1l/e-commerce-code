import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllProductsOfShopApi } from '../../api/api';
import { IProduct } from '../../interfaces';
import { ProductItemShop } from '../product/ProductItemShop';
import { ShopAdminLayout } from './ShopAdminLayout';

type Props = {};

export const ShopAdminProduct = ({}: Props) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const shopId = useParams()['shopId'];

  const { data } = useQuery({
    queryKey: [`productsOfShop/${shopId}`],
    queryFn: () => getAllProductsOfShopApi(shopId!),
    enabled: !!shopId,
  });

  useEffect(() => {
    if (data) {
      // @ts-ignore
      setProducts(data);
    }
  }, [data]);

  return (
    <ShopAdminLayout>
      <div>
        {products.length > 0 ? (
          <div className='px-4 mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-3'>
            {products.map((product) => (
              <ProductItemShop key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className='w-full h-64 flex justify-center items-center'>
            Shop chưa có sản phẩm nào, thêm sản phầm trước khi vào đây
          </div>
        )}
      </div>
    </ShopAdminLayout>
  );
};
