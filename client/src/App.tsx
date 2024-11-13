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
