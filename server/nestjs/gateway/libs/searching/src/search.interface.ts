import { SearchType } from '@libs/searching/searchType.enum';

export interface ISearch {
  data: string;
  type: SearchType;
}
