import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IShopAddress } from '@app/interfaces';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ShopDocument = HydratedDocument<Shop>;

@Schema()
export class Shop {
  @Prop({ required: true })
  name: string;

  @Prop()
  logo: string;

  @Prop()
  telephone: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: MongooseSchema.Types.Map })
  address: IShopAddress;

  @Prop({ select: false })
  __v: number;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
