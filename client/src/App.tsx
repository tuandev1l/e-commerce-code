import { Route, Routes, Navigate } from 'react-router-dom';
import { isLoginSelector } from './store/selector';
import { useSelector } from 'react-redux';
import {
  ForgotPassword,
  Login,
  ResetPassword,
  VerifyUser,
} from './components/auth';
import { Signup } from './components/auth';
import NotFound from './components/not-found/NotFound';
import { Main } from './components/main/Main';
import { ProductDetail } from './components/product';
import { Shop } from './components/shop';
import { UserAddress, UserProfile } from './components/user';
import { ChangePassword } from './components/user/ChangePassword';
import { Cart } from './components/cart';
import { Order } from './components/order';
import Checkout from './components/order/Checkout';
import { VNPayPayment } from './components/order/VNPayPayment';
import { ShopAdmin } from './components/shop-admin/ShopAdmin';
import { ShopAdminRegister } from './components/shop-admin/ShopAdminRegister';
import { ShopAdminProduct } from './components/shop-admin/ShopAdminProduct';
import { ShopAdminStatistic } from './components/shop-admin/ShopAdminStatistic';
import { ShopAdminProductDetail } from './components/shop-admin/ShopAdminProductDetail';
import { ShopAdminProductCreate } from './components/shop-admin/ShopAdminProductCreate';
import { Admin } from './components/admin/Admin';
import { ChangeOrderStatus } from './components/admin/ChangeOrderStatus';
import { Report } from './components/admin/Report';
import { ShopAdminPreparedOrders } from './components/shop-admin/ShopAdminPreparedOrders';

function App() {
  const isLogin = useSelector(isLoginSelector);

  return (
    <Routes>
      <Route path='/auth/verify/:resetToken' element={<VerifyUser />} />
      <Route path='/auth/forgot-password' element={<ForgotPassword />} />
      <Route
        path='/auth/reset-password/:resetToken'
        element={<ResetPassword />}
      />
      <Route
        path='/auth/login'
        element={isLogin ? <Navigate to={'/'} /> : <Login />}
      />
      <Route
        path='/admin'
        element={!isLogin ? <Navigate to={'/auth/login'} /> : <Admin />}
      />
      <Route
        path='/admin/change-order-status'
        element={
          !isLogin ? <Navigate to={'/auth/login'} /> : <ChangeOrderStatus />
        }
      />
      <Route
        path='/admin/product-report'
        element={!isLogin ? <Navigate to={'/auth/login'} /> : <Report />}
      />
      <Route
        path='/shop-admin/register'
        element={
          !isLogin ? <Navigate to={'/auth/login'} /> : <ShopAdminRegister />
        }
      />
      <Route
        path='/shop-admin/:shopId/prepared-orders'
        element={
          !isLogin ? (
            <Navigate to={'/auth/login'} />
          ) : (
            <ShopAdminPreparedOrders />
          )
        }
      />
      <Route
        path='/shop-admin/:shopId/product'
        element={
          !isLogin ? <Navigate to={'/auth/login'} /> : <ShopAdminProduct />
        }
      />
      <Route
        path='/shop-admin/:shopId/product/create'
        element={
          !isLogin ? (
            <Navigate to={'/auth/login'} />
          ) : (
            <ShopAdminProductCreate />
          )
        }
      />
      <Route
        path='/shop-admin/:shopId/product/:productId'
        element={
          !isLogin ? (
            <Navigate to={'/auth/login'} />
          ) : (
            <ShopAdminProductDetail />
          )
        }
      />
      <Route
        path='/shop-admin/:shopId/statistic'
        element={
          !isLogin ? <Navigate to={'/auth/login'} /> : <ShopAdminStatistic />
        }
      />
      <Route
        path='/admin'
        element={!isLogin ? <Navigate to={'/'} /> : <Admin />}
      />
      <Route
        path='/shop-admin/:shopId'
        element={!isLogin ? <Navigate to={'/auth/login'} /> : <ShopAdmin />}
      />
      <Route
        path='/auth/signup'
        element={isLogin ? <Navigate to={'/'} /> : <Signup />}
      />
      <Route
        path='/product/:productId'
        element={isLogin ? <ProductDetail /> : <Navigate to={'/auth/login'} />}
        // element={<ProductDetail />}
      />
      <Route
        path='/shop/:slug'
        element={isLogin ? <Shop /> : <Navigate to={'/auth/login'} />}
      />
      <Route
        path='/me'
        element={isLogin ? <UserProfile /> : <Navigate to={'/auth/login'} />}
      />
      <Route
        path='/me/password'
        element={isLogin ? <ChangePassword /> : <Navigate to={'/auth/login'} />}
      />
      <Route
        path='/cart'
        element={isLogin ? <Cart /> : <Navigate to={'/auth/login'} />}
      />
      <Route
        path='/order'
        element={isLogin ? <Order /> : <Navigate to={'/auth/login'} />}
      />
      <Route
        path='/checkout'
        element={isLogin ? <Checkout /> : <Navigate to={'/auth/login'} />}
      />
      <Route
        path='/user-address'
        element={isLogin ? <UserAddress /> : <Navigate to={'/auth/login'} />}
      />
      <Route
        path='/vnpay-payment'
        element={isLogin ? <VNPayPayment /> : <Navigate to={'/auth/login'} />}
      />
      <Route path='/' element={<Main />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
