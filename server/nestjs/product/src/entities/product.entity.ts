import InventoryStatusEnum from '@lib/product/enum';
import { IProductBadge, IProductImage } from '@lib/product/interfaces';
import { Brand } from '@lib/product/entities/brand.entity';
import { Category } from '@lib/product/entities/category.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Shop } from '@lib/product/entities/shop.entity';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  short_description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  list_price: number;

  @Prop({ required: true })
  original_price: number;

  @Prop({ required: true })
  badges: IProductBadge[];

  @Prop({ required: true })
  discount: number;

  @Prop({ required: true })
  discount_rate: number;

  @Prop({ required: true })
  rating_average: number;

  @Prop({ required: true })
  review_count: number;

  @Prop({ required: true })
  review_text: string;

  @Prop({ required: true })
  favourite_count: number;

  @Prop({ required: true })
  thumbnail_url: string;

  @Prop({ required: true })
  inventory_status: InventoryStatusEnum;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shop' })
  seller: Shop;

  @Prop({ required: true })
  all_time_quantity_sold: number;

  @Prop()
  meta_title: string;

  @Prop()
  meta_description: string;

  @Prop()
  meta_keywords: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  images: IProductImage[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Brand' })
  brand: Brand;

  @Prop({ required: true, type: MongooseSchema.Types.Array })
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
          code: 'brand_country';
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
          code: 'is_warranty_applied';
          name: 'Sản phẩm có được bảo hành không?';
          value: string;
        },
      ];
    },
  ];

  @Prop({ required: true })
  configurable_options: [
    {
      code: 'option1';
      name: 'Màu';
      position: 0;
      show_preview_image: true;
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
      show_preview_image: false;
      values: [
        {
          label: string;
        },
      ];
    },
  ];

  // problem here
  @Prop({ type: MongooseSchema.Types.Map })
  highlight: {
    items: string[];
    title: string;
  };

  // here
  @Prop({ type: MongooseSchema.Types.Map })
  stock_item: {
    max_sale_qty: number;
    min_sale_qty: number;
    preorder_date?: string;
    qty: number;
  };

  @Prop({ required: true, type: MongooseSchema.Types.Map })
  quantity_sold: {
    text: string;
    value: number;
  };

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  categories: Category;

  @Prop()
  video_url?: string;

  @Prop()
  is_seller_in_chat_whitelist: boolean = true;

  @Prop({ required: true, type: MongooseSchema.Types.Array })
  warranty_info: [
    {
      name: 'Hướng dẫn bảo hành';
      value: 'Xem chi tiết';
      url: string;
    },
  ];

  @Prop({ required: true })
  return_and_exchange_policy: string;

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
      sub_text: [];
    },
  ];

  @Prop({ type: MongooseSchema.Types.Map })
  return_policy: {
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
