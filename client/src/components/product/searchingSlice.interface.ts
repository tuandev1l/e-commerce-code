import { SearchType } from '../../dto/productFilter.dto';

export interface ISearchingSlice {
  keyword: string;
  categories: string[];
  brands: string[];
  fromNumber: number;
  toNumber: number;
  page: number;
  usingKnn: boolean;
  type: SearchType;
}

export const initialSearchingDefault: ISearchingSlice = {
  keyword: '',
  categories: [],
  brands: [],
  fromNumber: 0,
  toNumber: 99999999,
  page: 1,
  usingKnn: false,
  type: SearchType.TEXT,
};
