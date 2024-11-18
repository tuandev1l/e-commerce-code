import { useState } from 'react';
import { IResponseData } from './Main';
import { useAppDispatch } from '../../store/store';
import { setCheckedBrand } from '../product/searchingSlice';

type Props = {
  brand: IResponseData;
};

export const Brand = ({ brand }: Props) => {
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <div>
      <input
        id={brand._id}
        type='checkbox'
        checked={checked}
        onClick={() => {
          setChecked(!checked);
          dispatch(setCheckedBrand(brand._id));
        }}
        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
      />
      <label
        htmlFor={brand._id}
        className={`hover:cursor-pointer px-2 py-1 border-gray-400 rounded-2xl mr-2 ${
          brand.select && 'border-blue-800'
        }`}
      >
        {brand.name}
      </label>
    </div>
  );
};
