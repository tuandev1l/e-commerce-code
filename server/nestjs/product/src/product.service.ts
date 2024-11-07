import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '@lib/product/entities/product.entity';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from '@lib/product/entities/brand.entity';
import {
  Category,
  CategoryDocument,
} from '@lib/product/entities/category.entity';
import { Shop, ShopDocument } from '@lib/product/entities/shop.entity';
import slugify from 'slugify';
import { ProductDto } from '@lib/product/dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly model: Model<ProductDocument>,
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
  ) {}

  async create(productDto: ProductDto) {
    return this.model.create(productDto);
  }

  async findAll() {
    return this.model.find().exec();
  }

  async findOne(id: string) {
    return this.model.findById(id).exec();
  }

  async update(id: string, productDto: ProductDto) {
    await this.findOneAndValidate(id);
    return this.model.create({ id, ...productDto });
  }

  async remove(id: string) {
    return this.model.deleteOne({ id }).exec();
  }

  private async findOneAndValidate(id: string) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException('There is no product with this id');
    }
    return product;
  }

  // async insertData() {
  //   const rawData = await readFile('../../../crawl/data.json', 'utf-8');
  //   const data = JSON.parse(rawData) as ProductDocument[];
  //
  //   const savedData: ProductDocument[] = [];
  //
  //   for (const product of data) {
  //     try {
  //       product.badges = product['badges_v3'];
  //       product.rating_average = 0;
  //       product.review_text = '0';
  //       product.review_count = 0;
  //       product.all_time_quantity_sold = 0;
  //
  //       const { brand, categories } = product;
  //       const seller = product['current_seller'];
  //
  //       const brandSlug = this.getSlugName(brand.name);
  //       const brandEntity = await this.brandModel
  //         .findOne({ slug: brandSlug })
  //         .exec();
  //       if (!brandEntity) {
  //         product.brand = await this.brandModel.create({
  //           ...brand,
  //           slug: brandSlug,
  //         });
  //       } else {
  //         product.brand = brandEntity;
  //       }
  //
  //       const categorySlug = this.getSlugName(categories.name);
  //       const categoryEntity = await this.categoryModel
  //         .findOne({ slug: categorySlug })
  //         .exec();
  //       if (!categoryEntity) {
  //         product.categories = await this.categoryModel.create({
  //           ...categories,
  //           slug: categorySlug,
  //         });
  //       } else {
  //         product.categories = categoryEntity;
  //       }
  //
  //       const shopEntity = await this.shopModel
  //         .findOne({ name: seller.name })
  //         .exec();
  //       if (!shopEntity) {
  //         const newShop = new Shop();
  //         newShop.name = seller.name;
  //         newShop.url = seller['link'];
  //         newShop.logo = seller.logo;
  //         newShop.telephone = '';
  //         newShop.address = {
  //           streetAddress: '',
  //           addressLocality: '',
  //           postalCode: '',
  //           addressRegion: '',
  //           addressCountry: '',
  //         };
  //
  //         product.seller = await this.shopModel.create(newShop);
  //       } else {
  //         product.seller = shopEntity;
  //       }
  //
  //       const savedProduct = await this.model.create(product);
  //       savedData.push(savedProduct);
  //     } catch (e) {
  //       console.error(`Error at productId: ${product.id}`);
  //       console.log(e);
  //     }
  //   }
  //
  //   return savedData;
  // }

  private getSlugName(name: string): string {
    return slugify(name, {
      locale: 'vi',
      lower: true,
      trim: true,
    });
  }
}
