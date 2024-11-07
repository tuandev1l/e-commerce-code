import { ReactElement } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';

type Props = {
  children: ReactElement;
};

export const Layout = ({ children }: Props) => {
  return (
    <div
      className='bg-gray-100 w-full flex flex-col items-center min-h-full'
      style={{ minHeight: '100vh' }}
    >
      <Header />
      <div className='flex w-full flex-col items-center flex-1 my-8'>
        {children}
      </div>
      <Footer />
    </div>
  );
};
