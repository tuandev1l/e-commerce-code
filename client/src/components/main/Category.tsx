import { useState } from 'react';
import { IResponseData } from './Main';
import { useAppDispatch } from '../../store/store';
import { setCheckedCategories } from '../product/searchingSlice';

type Props = {
  category: IResponseData;
};

export const Category = ({ category }: Props) => {
  const [checked, setChecked] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  return (
    <div>
      <input
        id={category._id}
        type='checkbox'
        checked={checked}
        onClick={() => {
          setChecked(!checked);
          dispatch(setCheckedCategories(category._id));
        }}
        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
      />
      <label
        htmlFor={category._id}
        className={`hover:cursor-pointer px-2 py-1 border-gray-400 rounded-2xl mr-2 ${
          category.select && 'border-blue-800'
        }`}
      >
        {category.name}
      </label>
    </div>
  );
};
