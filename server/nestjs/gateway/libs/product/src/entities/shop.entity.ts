import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { IUserAddress } from '@share/interfaces';

export type ShopDocument = HydratedDocument<Shop>;

@Schema({ timestamps: true })
export class Shop {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop()
  logo: string;

  @Prop()
  telephone: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: MongooseSchema.Types.Map })
  address: IUserAddress;

  @Prop({ select: false })
  __v: number;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
