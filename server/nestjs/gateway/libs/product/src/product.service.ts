import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Product,
  ProductDocument,
} from '@libs/product/entities/product.entity';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from '@libs/product/entities/brand.entity';
import {
  Category,
  CategoryDocument,
} from '@libs/product/entities/category.entity';
import { Shop, ShopDocument } from '@libs/product/entities/shop.entity';
import slugify from 'slugify';
import { RpcNotFound } from '@base/exception/exception.resolver';
import { CreateProductDto } from '@libs/product/dto/product/withUser/create-product.dto';
import { UpdateProductDto } from '@libs/product/dto/product/withUser/update-product.dto';
import { UpdateBrandDto } from '@libs/product/dto/brand/update-brand.dto';
import { UpdateCategoryDto } from '@libs/product/dto/category/update-category.dto';
import { UpdateShopDto } from '@libs/product/dto/shop/update-shop.dto';
import { readFile } from 'fs/promises';
import InventoryStatusEnum from '@libs/product/enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly model: Model<ProductDocument>,
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
  ) {}

  async insertData() {
    const rawData = await readFile(
      '/home/tuantm/schooling/ending_project_code/crawl/formatted_data_camelCase.json',
      'utf-8',
    );
    const data = JSON.parse(rawData) as ProductDocument[];

    const savedData: ProductDocument[] = [];

    for (const product of data) {
      try {
        product.badges = product['badgesV3'];
        product.inventoryStatus = InventoryStatusEnum.AVAILABLE;

        const { brand, categories } = product;
        const seller = product['currentSeller'];

        const brandSlug = this.getSlugName(brand.name);
        const brandEntity = await this.brandModel
          .findOne({ slug: brandSlug })
          .exec();
        if (!brandEntity) {
          product.brand = await this.brandModel.create({
            ...brand,
            slug: brandSlug,
          });
        } else {
          product.brand = brandEntity;
        }

        const categorySlug = this.getSlugName(categories.name);
        const categoryEntity = await this.categoryModel
          .findOne({ slug: categorySlug })
          .exec();
        if (!categoryEntity) {
          product.categories = await this.categoryModel.create({
            ...categories,
            slug: categorySlug,
          });
        } else {
          product.categories = categoryEntity;
        }

        const shopEntity = await this.shopModel
          .findOne({ name: seller.name })
          .exec();
        if (!shopEntity) {
          const newShop = new Shop();
          newShop.name = seller.name;
          newShop.url = seller['link'];
          newShop.logo = seller.logo;
          newShop.telephone = '';
          newShop.address = {
            streetAddress: '',
            addressLocality: '',
            postalCode: '',
            addressRegion: '',
            addressCountry: '',
          };

          product.seller = await this.shopModel.create(newShop);
        } else {
          product.seller = shopEntity;
        }

        const savedProduct = await this.model.create(product);
        savedData.push(savedProduct);
      } catch (e) {
        console.error(`Error at productId: ${product.id}`);
        console.log(e);
      }
    }

    return savedData;
  }

  async create(productDto: CreateProductDto) {
    return this.model.create(productDto);
  }

  async findAll() {
    return this.model.find().exec();
  }

  async findOne(id: string) {
    const product = await this.model.findById(id).exec();
    if (!product) {
      throw new RpcNotFound('There is no product with this id');
    }
    return product;
  }

  async update(productDto: UpdateProductDto) {
    const product = await this.findOne(productDto.productId);
    return this.model.create({ _id: product._id, ...productDto });
  }

  async remove(id: string) {
    return this.model.deleteOne({ id }).exec();
  }

  // BRAND

  async createBrand(createBrandDto) {
    const { name } = createBrandDto;
    return this.brandModel.create({
      name,
      slug: this.getSlugName(name),
    });
  }

  async getBrand(brandId: string) {
    const brand = await this.brandModel.findById(brandId).exec();
    if (!brand) {
      throw new RpcNotFound('There is no brand with this ID');
    }
    return brand;
  }

  async getBrandByName(brandName: string) {
    const brand = await this.brandModel.findOne({ name: brandName }).exec();
    if (!brand) {
      throw new RpcNotFound('There is no brand with this ID');
    }
    return brand;
  }

  async getAllBrands() {
    return this.brandModel.find().exec();
  }

  async updateBrand(updateBrandDto: UpdateBrandDto) {
    const { name } = updateBrandDto;
    const brand = await this.getBrand(updateBrandDto.brandId);
    return this.brandModel.create({
      ...brand,
      name,
      slug: this.getSlugName(name),
    });
  }

  // CATEGORY
  async createCategory(createCategoryDto) {
    const { name } = createCategoryDto;
    return this.categoryModel.create({
      name,
      slug: this.getSlugName(name),
    });
  }

  async getCategory(categoryId: string) {
    const category = await this.categoryModel.findById(categoryId).exec();
    if (!category) {
      throw new RpcNotFound('There is no category with this ID');
    }
    return category;
  }

  async getCategoryByName(categoryName: string) {
    const category = await this.categoryModel
      .findOne({ name: categoryName })
      .exec();
    if (!category) {
      throw new RpcNotFound('There is no category with this ID');
    }
    return category;
  }

  async getAllCategories() {
    return this.categoryModel.find().exec();
  }

  async updateCategory(updateCategoryDto: UpdateCategoryDto) {
    const { name } = updateCategoryDto;
    const category = await this.getCategory(updateCategoryDto.categoryId);
    return this.categoryModel.create({
      ...category,
      name,
      slug: this.getSlugName(name),
    });
  }

  // SHOP
  async createShop(createShopDto) {
    const { name } = createShopDto;
    return this.shopModel.create({
      name,
      slug: this.getSlugName(name),
    });
  }

  async getShop(shopId: string) {
    const shop = await this.shopModel.findById(shopId).exec();
    if (!shop) {
      throw new RpcNotFound('There is no shop with this ID');
    }
    return shop;
  }

  async getShopByName(shopName: string) {
    const shop = await this.shopModel.findOne({ name: shopName }).exec();
    if (!shop) {
      throw new RpcNotFound('There is no shop with this ID');
    }
    return shop;
  }

  async getAllShops() {
    return this.shopModel.find().exec();
  }

  async updateShop(updateShopDto: UpdateShopDto) {
    const { name } = updateShopDto;
    const shop = await this.getShop(updateShopDto.shopId);
    return this.shopModel.create({
      ...shop,
      name,
      slug: this.getSlugName(name),
    });
  }

  private getSlugName(name: string): string {
    return slugify(name, {
      locale: 'vi',
      lower: true,
      trim: true,
    });
  }
}
