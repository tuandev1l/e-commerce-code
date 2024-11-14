import { useState } from 'react';
import { IResponseData } from './Main';

type Props = {
  category: IResponseData;
  setCheckedCategory: Function;
};

export const Category = ({ category, setCheckedCategory }: Props) => {
  const [checked, setChecked] = useState<boolean>(false);
  return (
    <div>
      <input
        id={category._id}
        type='checkbox'
        checked={checked}
        onClick={() => {
          setChecked(!checked);
          setCheckedCategory(category._id);
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
