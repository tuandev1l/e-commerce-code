import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getCartApi } from '../../api/api';
import { Layout } from '../../common/layout/Layout';
import { priceSplit } from '../../common/price/priceSplit';
import { IProductItemMinimal } from '../../interfaces/productItemMinimal.interface';
import {
  addressSelector,
  productsInCartSelector,
  roleSelector,
  usernameSelector,
} from '../../store/selector';
import { useAppDispatch } from '../../store/store';
import { getAllProductsInCart, setProductItemSelected } from './cartSlice';
import { ProductInCart } from './ProductInCart';
import useToast from '../../hook/useToast';
import { useNavigate } from 'react-router-dom';
import { Role } from '../../enum/role.user.enum';
type Props = {};

export const Cart = ({}: Props) => {
  const userRole = useSelector(roleSelector);
  const navigate = useNavigate();
  const toast = useToast();
  const username = useSelector(usernameSelector);
  const dispatch = useAppDispatch();
  const products = useSelector(productsInCartSelector);
  const addresses = useSelector(addressSelector);
  const [productCheckStatus, setProductCheckStatus] = useState<boolean[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [productSelected, setProductSelected] = useState<IProductItemMinimal[]>(
    []
  );

  useEffect(() => {
    console.log(productSelected);
  }, [productSelected]);

  const { data } = useQuery({
    queryKey: [`listProductInCart/${username}`],
    queryFn: getCartApi,
  });

  useEffect(() => {
    if (products) {
      setProductCheckStatus(new Array(products.length).fill(false));
    }
  }, [products]);

  useEffect(() => {
    if (data) {
      dispatch(getAllProductsInCart(data));
    }
  }, [data]);

  const productCheckHandler = (idx: number) => {
    productCheckStatus[idx] = !productCheckStatus[idx];
    setProductCheckStatus([...productCheckStatus]);
  };

  const updateQuantityHandler = (
    productId: string,
    amount: number,
    price: number,
    discountPrice: number
  ) => {
    setTotalPrice(totalPrice + amount * price);
    setDiscount(discount + amount * discountPrice);
    const idx = productSelected.findIndex((pd) => pd.uuid === productId);
    if (idx !== -1) {
      productSelected[idx].quantity += amount;
      setProductSelected([...productSelected]);
    }
  };

  const removeItemHandler = (
    price: number,
    discountPrice: number,
    productId: string
  ) => {
    setTotalPrice(totalPrice - price);
    setDiscount(discount - discountPrice);
    const selectedIdx = productSelected.findIndex(
      (pd) => pd.uuid === productId
    );
    if (selectedIdx !== -1) {
      productSelected.splice(selectedIdx, 1);
      setProductSelected([...productSelected]);
    }
  };

  const productSelectHandler = (
    productItem: IProductItemMinimal,
    quantity: number,
    isSelected: boolean
  ) => {
    if (isSelected) {
      setTotalPrice(totalPrice + productItem.price * quantity);
      setDiscount(discount + productItem.discount * quantity);
      const productItemSelected = { ...productItem, quantity };
      setProductSelected([...productSelected, productItemSelected]);
    } else {
      const idx = productSelected.findIndex(
        (pd) => pd.uuid === productItem.uuid
      );
      if (idx !== -1) {
        setTotalPrice(totalPrice - productItem.price * quantity);
        setDiscount(discount - productItem.discount * quantity);
        productSelected.splice(idx, 1);
        const newProductSelected = [...productSelected];
        setProductSelected(newProductSelected);
      }
    }
  };

  // useEffect(() => {
  //   console.log(productSelected);
  // }, [productSelected]);

  const buyProductHandler = () => {
    if (userRole !== Role.USER) {
      toast({
        type: 'error',
        message: 'Bạn không thể mua hàng với tài khoản này',
      });
      return;
    }
    if (addresses?.length) {
      dispatch(setProductItemSelected(productSelected));
      setTimeout(() => {
        navigate('/checkout');
      }, 500);
    } else {
      toast({
        type: 'error',
        message: 'You have to add address and phone before ordering products',
      });
      setTimeout(() => {
        navigate('/user-address');
      }, 500);
    }
  };

  return (
    <Layout>
      <div className='flex justify-center p-2 w-11/12'>
        <div className='w-full'>
          {products.length > 0 ? (
            <>
              <h2 className='text-2xl font-semibold mb-4'>Giỏ Hàng</h2>
              <div className='flex gap-3'>
                <div className='flex-1 rounded-lg mr-4'>
                  {/* Header Row */}
                  <div className='flex items-center py-2 px-4 bg-white font-semibold mb-4 rounded-lg'>
                    <div className='w-1/2 flex items-center'>
                      <span>Sản phẩm</span>
                    </div>
                    <div className='w-1/3 text-center'>Đơn giá</div>
                    <div className='w-32 text-center'>Số lượng</div>
                    <div className='w-32 text-center'>Thành tiền</div>
                    <div className='w-8 text-center'>Xóa</div>
                  </div>

                  {products.map((product, productIndex) => (
                    <ProductInCart
                      removeItemHandler={removeItemHandler}
                      key={productIndex}
                      product={product}
                      productIndex={productIndex}
                      updateQuantityHandler={updateQuantityHandler}
                      productSelectHandler={productSelectHandler}
                      productCheckHandler={productCheckHandler}
                    />
                  ))}
                </div>

                <div className='sticky top-4 bg-white p-4 rounded-lg h-fit mb-4 w-72'>
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='font-semibold'>Tiki Khuyến Mãi</h3>
                    <button className='text-blue-500 font-medium'>
                      Áp Dụng
                    </button>
                  </div>
                  <div className='flex justify-between mb-2'>
                    <span>Tạm tính</span>
                    <span>{priceSplit(totalPrice + discount)}</span>
                  </div>
                  <div className='flex justify-between text-green-500 font-semibold mb-2'>
                    <span>Giảm giá từ Deal</span>
                    <span>-{priceSplit(discount)}₫</span>
                  </div>
                  <hr className='my-4' />
                  <div className='flex justify-between text-red-500 font-bold text-lg'>
                    <span>Tổng tiền</span>
                    <span>{priceSplit(totalPrice)}₫</span>
                  </div>
                  <div className='text-green-500 text-sm mb-4 mt-2'>
                    <span>
                      Tiết kiệm {priceSplit(discount)}₫ (Đã bao gồm VAT nếu có)
                    </span>
                  </div>
                  <button
                    className={`w-full bg-red-500 text-white font-semibold py-2 rounded-md hover:cursor-pointer ${
                      !productSelected.length &&
                      'disabled hover:cursor-not-allowed bg-red-400'
                    }`}
                    onClick={buyProductHandler}
                  >
                    Mua Hàng ({productSelected.length})
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className='w-full flex justify-center pt-12'>
              Bạn chưa có sản phẩm nào trong giỏ hàng, hãy thêm vào giỏ hàng
              trước khi quay lại đây nhé!
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
