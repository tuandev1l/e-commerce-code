import { InventoryStatusEnum } from '../enum';
import { IBrand } from './brand.interface';
import { ICategory } from './category.interface';
import { IProductBadge } from './productBadge.interface';
import { IProductImage } from './productImage.interface';
import { IShop } from './shop.interface';

export interface IProduct {
  _id: string;
  name: string;
  shortDescription: string;
  price: number;
  listPrice: number;
  originalPrice: number;
  badges: IProductBadge[];
  discount: number;
  discountRate: number;
  ratingAverage: number;
  reviewCount: number;
  reviewText: string;
  favouriteCount: number;
  thumbnailUrl: string;
  inventoryStatus: InventoryStatusEnum;
  seller?: IShop;
  allTimeQuantitySold: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  description: string;
  images: IProductImage[];
  brand?: IBrand;
  specifications: {
    name: string;
    attributes: {
      code: string;
      name: string;
      value: string;
    }[];
  }[];
  configurableOptions: {
    code: string;
    name: string;
    position: number;
    showPreviewImage: boolean;
    values: {
      label: string;
    }[];
  }[];
  highlight?: {
    items: string[];
    title: string;
  };
  stockItem?: {
    maxSaleQty: number;
    minSaleQty: number;
    preorderDate?: string;
    qty: number;
  };
  quantitySold: {
    text: string;
    value: number;
  };
  categories?: ICategory;
  videoUrl?: string;
  isSellerInChatWhitelist: boolean;
  warrantyInfo: {
    name: string;
    value: string;
    url: string;
  }[];
  returnAndExchangePolicy: string;
  benefits?: {
    icon: string;
    text: string;
    subText?: string[];
  }[];
  returnPolicy?: {
    body: {
      label: string;
      content: string[];
    }[];
    title: string;
  };
}
