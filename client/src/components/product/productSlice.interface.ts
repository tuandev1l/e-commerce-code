import { InventoryStatusEnum } from '../../enum';
import { IProduct } from '../../interfaces';

export interface IProductSlice {
  isLoading: boolean;
  totalPage: number;
  products: IProduct[];
  product: IProduct;
  error?: string;
}

export const productDefault: IProduct = {
  _id: '',
  name: '',
  shortDescription: '',
  price: 0,
  listPrice: 0,
  originalPrice: 0,
  badges: [
    {
      code: '',
      type: '',
      index: 0,
      icon: '',
      iconWidth: 0,
      iconHeight: 0,
      textColor: '',
      backgroundColor: '',
    },
  ],
  discount: 0,
  discountRate: 0,
  ratingAverage: 0,
  reviewCount: 0,
  reviewText: '',
  favouriteCount: 0,
  thumbnailUrl: '',
  inventoryStatus: InventoryStatusEnum.AVAILABLE,
  allTimeQuantitySold: 0,
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  description: '',
  images: [
    {
      baseUrl: '',
      isGallery: false,
      largeUrl: '',
      mediumUrl: '',
      smallUrl: '',
      thumbnailUrl: '',
    },
  ],
  brand: {
    id: '',
    name: '',
    slug: '',
  },
  seller: {
    id: '',
    name: '',
    logo: '',
    url: '',
  },
  specifications: [
    {
      name: '',
      attributes: [
        {
          code: '',
          name: '',
          value: '',
        },
      ],
    },
  ],
  configurableOptions: [
    {
      code: '',
      name: '',
      position: 0,
      showPreviewImage: false,
      values: [
        {
          label: '',
        },
      ],
    },
  ],
  highlight: {
    items: [''],
    title: '',
  },
  stockItem: {
    maxSaleQty: 0,
    minSaleQty: 0,
    qty: 0,
  },
  quantitySold: {
    text: '',
    value: 0,
  },
  categories: {
    id: '',
    name: '',
    slug: '',
  },
  isSellerInChatWhitelist: false,
  warrantyInfo: [
    {
      name: '',
      value: '',
      url: '',
    },
  ],
  returnAndExchangePolicy: '',
  benefits: [
    {
      icon: '',
      text: '',
    },
  ],
  returnPolicy: {
    body: [
      {
        label: '',
        content: [''],
      },
    ],
    title: '',
  },
};

export const productInitialState: IProductSlice = {
  isLoading: false,
  products: [],
  totalPage: 1,
  product: productDefault,
  error: '',
};
