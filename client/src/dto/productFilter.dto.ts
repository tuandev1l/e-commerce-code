export interface IProductFilter {
  keyword?: string;
  categories?: string[];
  brands?: string[];
  fromNumber?: number;
  toNumber?: number;
  page?: number;
  usingKnn: boolean;
  type?: SearchType;
}

export enum SearchType {
  'TEXT' = 'TEXT',
  'IMAGE' = 'IMAGE',
}
