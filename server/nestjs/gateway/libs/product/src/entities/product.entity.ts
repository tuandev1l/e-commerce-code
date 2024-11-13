import InventoryStatusEnum from '@libs/product/enum';
import { IProductBadge, IProductImage } from '@libs/product/interfaces';
import { Brand } from '@libs/product/entities/brand.entity';
import { Category } from '@libs/product/entities/category.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Shop } from '@libs/product/entities/shop.entity';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  shortDescription: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: 0 })
  listPrice: number;

  @Prop({ default: 0 })
  originalPrice: number;

  @Prop()
  badges: IProductBadge[];

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  discountRate: number;

  @Prop({ default: 0 })
  ratingAverage: number;

  @Prop({ default: 0 })
  reviewCount: number;

  @Prop()
  reviewText: string;

  @Prop({ default: 0 })
  favouriteCount: number;

  @Prop()
  thumbnailUrl: string;

  @Prop({ type: String, enum: InventoryStatusEnum })
  inventoryStatus: InventoryStatusEnum;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shop' })
  seller: Shop;

  @Prop({ default: 0 })
  allTimeQuantitySold: number;

  @Prop()
  metaTitle: string;

  @Prop()
  metaDescription: string;

  @Prop()
  metaKeywords: string;

  @Prop()
  description: string;

  @Prop()
  images: IProductImage[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Brand' })
  brand: Brand;

  @Prop({ type: MongooseSchema.Types.Array })
  specifications: [
    {
      name: 'Content';
      attributes: [
        {
          code: 'brand';
          name: 'Thương hiệu';
          value: string;
        },
        {
          code: 'brandCountry';
          name: 'Xuất xứ thương hiệu';
          value: string;
        },
        {
          code: 'origin';
          name: 'Xuất xứ (Made in)';
          value: string;
        },
      ];
    },
    {
      name: 'Operation';
      attributes: [
        {
          code: 'isWarrantyApplied';
          name: 'Sản phẩm có được bảo hành không?';
          value: string;
        },
      ];
    },
  ];

  @Prop()
  configurableOptions: [
    {
      code: 'option1';
      name: 'Màu';
      position: 0;
      showPreviewImage: true;
      values: [
        {
          label: string;
        },
      ];
    },
    {
      code: 'option2';
      name: 'Kích cỡ';
      position: 0;
      showPreviewImage: false;
      values: [
        {
          label: string;
        },
      ];
    },
  ];

  @Prop({ type: MongooseSchema.Types.Map })
  highlight: {
    items: string[];
    title: string;
  };

  @Prop({ type: MongooseSchema.Types.Map })
  stockItem: {
    maxSaleQty: number;
    minSaleQty: number;
    preorderDate?: string;
    qty: number;
  };

  @Prop({ type: MongooseSchema.Types.Map })
  quantitySold: {
    text: string;
    value: number;
  };

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  categories: Category;

  @Prop()
  videoUrl?: string;

  @Prop()
  isSellerInChatWhitelist: boolean = true;

  @Prop({ type: MongooseSchema.Types.Array })
  warrantyInfo: [
    {
      name: 'Hướng dẫn bảo hành';
      value: 'Xem chi tiết';
      url: string;
    },
  ];

  @Prop()
  returnAndExchangePolicy: string;

  @Prop({ type: MongooseSchema.Types.Array })
  benefits: [
    {
      icon: 'https://salt.tikicdn.com/ts/upload/c5/37/ee/76c708d43e377343e82baee8a0340297.png';
      text: 'Được đồng kiểm khi nhận hàng';
    },
    {
      icon: 'https://salt.tikicdn.com/ts/upload/ea/02/b4/b024e431ec433e6c85d4734aaf35bd65.png';
      text: 'Được hoàn tiền 200% nếu là hàng giả.';
    },
    {
      icon: 'https://salt.tikicdn.com/ts/upload/d8/c7/a5/1cd5bd2f27f9bd74b2c340b8e27c4d82.png';
      text: 'Đổi trả miễn phí trong 30 ngày. Được đổi ý.';
      subText: [];
    },
  ];

  @Prop({ type: MongooseSchema.Types.Map })
  returnPolicy: {
    body: [
      {
        label: '';
        content: [
          'Được đổi ý (sản phẩm phải còn nguyên hộp, tem, phụ kiện, chưa kích hoạt bảo hành, không áp dụng đơn hàng trả góp), hoặc',
          'Sản phẩm không đúng cam kết (lỗi kỹ thuật, giao sai/thiếu, bể vỡ…)',
        ];
      },
    ];
    title: 'Đổi trả miễn phí trong 30 ngày';
  };

  @Prop({ select: false })
  __v: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
