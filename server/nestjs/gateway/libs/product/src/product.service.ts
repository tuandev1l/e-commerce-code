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
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRating } from '@libs/rating/entity/productRating.entity';
import { Repository } from 'typeorm';
import { Rating } from '@libs/rating/entity/rating.entity';
import { User } from '@user/entities/user.entity';
import { AuthService } from '@auth/auth.service';
import { ACCOUNT_TYPE, GENDER } from '@share/enums';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly model: Model<ProductDocument>,
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    @InjectRepository(ProductRating)
    private readonly productRatingRepo: Repository<ProductRating>,
    @InjectRepository(Rating) private readonly ratingRepo: Repository<Rating>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async insertData() {
    const rawData = await readFile(
      '/home/tuantm/schooling/ending_project/crawl/resolved_products.json',
      'utf-8',
    );
    const data = JSON.parse(rawData) as ProductDocument[];

    const savedData: ProductDocument[] = [];

    for (const product of data) {
      try {
        // product.badges = product['badgesV3'];
        product.inventoryStatus = InventoryStatusEnum.AVAILABLE;

        // @ts-ignore
        const { brand, categories, seller, reviews } = product;

        // const seller = product['currentSeller'];

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
          // @ts-ignore
          newShop.telephone = product.telephone;
          newShop.address = seller.address;
          newShop.slug = this.getSlugName(seller.name);

          product.seller = await this.shopModel.create(newShop);
        } else {
          product.seller = shopEntity;
        }

        const savedProduct = await this.model.create(product);

        const productRating = this.productRatingRepo.create();
        productRating.stars = reviews['stars'];
        productRating.ratingAverage = reviews['ratingAverage'];
        productRating.reviewsCount = reviews['reviewsCount'];
        productRating.reviewPhoto = reviews['reviewPhoto'];

        // @ts-ignore
        productRating.productId = savedProduct._id.toString();

        void this.productRatingRepo.save(productRating);
        const ratingData: Rating[] = [];

        for (const rating of reviews.data) {
          const newRating = this.ratingRepo.create();
          newRating.title = rating.title;
          newRating.content = rating.content;
          newRating.thankCount = rating.thankCount;
          newRating.commentCount = rating.commentCount;
          newRating.rating = rating.rating;
          newRating.images = rating.images;
          newRating.productAttributes = rating.productAttributes;
          newRating.hadPhoto = rating.isPhoto;
          // @ts-ignore
          newRating.productId = savedProduct._id.toString();
          newRating.timeline = rating.timeline;

          const user = rating.createdBy;

          const email =
            slugify(user.name, {
              replacement: '',
              locale: 'vi',
              trim: true,
              lower: true,
            }) + '@gmail.com';

          const existedUser = await this.userRepo.findOneBy({ email });
          if (existedUser) {
            newRating.userId = existedUser.id;
          } else {
            const newUser = this.userRepo.create();
            newUser.name = user.fullName;
            newUser.isEmailVerified = true;
            newUser.password = await this.authService.hashPassword('123456789');
            newUser.email = email;

            newUser.gender = GENDER.MALE;
            newUser.birthday = new Date('2000-01-01');
            newUser.accountType = ACCOUNT_TYPE.EMAIL;
            newUser.hasPassword = true;
            newUser.avatarUrl = `https://avatar.iran.liara.run/public/boy?username=${user.fullName}`;
            newUser.joinedTime = user.joinedTime;
            newUser.totalReview = user.totalReview;
            newUser.totalThank = user.totalThank;

            const savedUser = await this.userRepo.save(newUser);
            newRating.userId = savedUser.id;
          }
          ratingData.push(newRating);
        }

        if (ratingData.length > 0) {
          void this.ratingRepo.save(ratingData);
        }

        // savedData.push(savedProduct);
      } catch (e) {
        console.error(`Error at productId: ${product.id}`);
        console.log(e);
      }
      // break;
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
