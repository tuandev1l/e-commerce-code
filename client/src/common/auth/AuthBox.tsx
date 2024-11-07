import { ReactElement } from 'react';

type Props = {
  children: ReactElement;
};

export const AuthBox = ({ children }: Props) => {
  return (
    <div className='w-9/12 p-4 mb-4 my-8 rounded-xl flex justify-center items-center'>
      {children}
    </div>
  );
};
