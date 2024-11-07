import { ReactElement } from 'react';

type Props = {
  children: ReactElement;
};

export const BoxWrapper = ({ children }: Props) => {
  return <div className='flex-1'>{children}</div>;
};
