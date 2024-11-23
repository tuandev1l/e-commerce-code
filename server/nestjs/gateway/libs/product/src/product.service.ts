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
import { RpcBadRequest, RpcNotFound } from '@base/exception/exception.resolver';
import { CreateProductDto } from '@libs/product/dto/product/withUser/create-product.dto';
import { UpdateProductDto } from '@libs/product/dto/product/withUser/update-product.dto';
import { UpdateBrandDto } from '@libs/product/dto/brand/update-brand.dto';
import { UpdateCategoryDto } from '@libs/product/dto/category/update-category.dto';
import { UpdateShopDto } from '@libs/product/dto/shop/update-shop.dto';
import { readFile, writeFile } from 'fs/promises';
import InventoryStatusEnum from '@libs/product/enum';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRating } from '@libs/rating/entity/productRating.entity';
import { Repository } from 'typeorm';
import { Rating } from '@libs/rating/entity/rating.entity';
import { User } from '@user/entities/user.entity';
import { AuthService } from '@auth/auth.service';
import { ACCOUNT_TYPE, GENDER } from '@share/enums';
import { ProductFilterDto } from '@libs/product/dto/product/withoutUser/productFilter.dto';
import { ConfigService } from '@nestjs/config';
import { ProducerService } from '@gateway/service/producer.service';
import { SEARCHING_PATTERN } from '@constants';
import { CacheService } from '@libs/cache';
import { plainToInstance } from 'class-transformer';
import { ElasticsearchService } from '@libs/searching/elasticsearch.service';
import { CreateShopDto } from '@libs/product/dto/shop/create-shop.dto';
import { ApproveShopDto } from '@libs/product/dto/shop/approveShop.dto';
import { DeleteProductDto } from '@libs/product/dto/product/withUser/deleteProduct.dto';
import { Role } from '@auth';

@Injectable()
export class ProductService {
  private static LIMIT = 0;

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
    private readonly configService: ConfigService,
    private readonly producerService: ProducerService,
    private readonly cacheService: CacheService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {
    ProductService.LIMIT = this.configService.get('LIMIT_SEARCH');
  }

  async insertData() {
    const blacklist = [
      'mông',
      'biển',
      'ngực',
      'đồ ngủ',
      'khỏa thân',
      'đồ bơi',
      'sau sinh',
      'độn',
    ];

    const rawData = await readFile(
      '/home/tuantm/schooling/ending_project/crawl/final_resolved_products.json',
      'utf-8',
    );
    const data = JSON.parse(rawData);

    const savedProducts = [];

    for (const product of data) {
      try {
        if (blacklist.some((el) => product.name.includes(el))) {
          continue;
        }

        const existedProduct = await this.model
          .findOne({
            name: product.name,
          })
          .exec();
        if (existedProduct) {
          continue;
        }

        // product.badges = product['badgesV3'];
        product.inventoryStatus = InventoryStatusEnum.AVAILABLE;

        // @ts-ignore
        const { brand, categories, seller, reviews } = product;
        delete product['sku'];
        delete product['badgesNew'];
        delete product['trackingInfo'];
        delete product['breadcrumbs'];

        const minimalProduct = { ...product };
        delete minimalProduct['reviews'];
        delete minimalProduct['descriptionVector'];
        delete minimalProduct['imgVector'];

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

        minimalProduct.brand = product.brand;

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

        minimalProduct.categories = product.categories;

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
          newShop.address = {
            phoneNumber: seller.telephone,
            country: seller.country,
            province: seller.province,
            district: seller.district,
            ward: seller.ward,
            detailAddress: seller.detailAddress,
          };
          const slug = this.getSlugName(seller.name);
          newShop.slug = slug;

          product.seller = await this.shopModel.create(newShop);
          const newUser = this.userRepo.create();
          newUser.name = newShop.name;
          newUser.isEmailVerified = true;
          newUser.password = await this.authService.hashPassword('123456789');
          newUser.email = `${slug}@gmail.com`;

          newUser.gender = GENDER.MALE;
          newUser.birthday = new Date('2000-01-01');
          newUser.accountType = ACCOUNT_TYPE.EMAIL;
          newUser.hasPassword = true;
          newUser.avatarUrl = `https://avatar.iran.liara.run/public/boy?username=${newShop.name}`;
          // @ts-ignore
          newUser.shopId = newShop._id;
        } else {
          product.seller = shopEntity;
        }

        minimalProduct.seller = product.seller;

        const savedProduct = await this.model.create(minimalProduct);

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
            newUser.joinedTime = user.contributeInfo.summary.joinedTime;
            newUser.totalReview = user.contributeInfo.summary.totalReview;
            newUser.totalThank = user.contributeInfo.summary.totalThank;

            const savedUser = await this.userRepo.save(newUser);
            newRating.userId = savedUser.id;
          }
          ratingData.push(newRating);
        }

        if (ratingData.length > 0) {
          void this.ratingRepo.save(ratingData);
        }

        delete product['reviews'];
        // @ts-ignore
        const newProduct = { ...savedProduct._doc, id: savedProduct._id };
        delete newProduct._id;

        newProduct.seller = {
          ...newProduct.seller._doc,
          id: newProduct.seller._id,
        };
        delete newProduct.seller._id;

        newProduct.categories = {
          ...newProduct.categories._doc,
          id: newProduct.categories._id,
        };
        delete newProduct.categories['_id'];

        newProduct.brand = {
          ...newProduct.brand._doc,
          id: newProduct.brand._id,
        };
        delete newProduct.brand['_id'];

        newProduct['descriptionVector'] = product['descriptionVector'];
        newProduct['imgVector'] = product['imgVector'];

        savedProducts.push(newProduct);
      } catch (e) {
        console.error(`Error at productId: ${product.id}`);
        console.log(e);
      }
    }

    await writeFile('./vector.json', JSON.stringify(savedProducts), {
      encoding: 'utf-8',
    });
  }

  async create(productDto: CreateProductDto) {
    return this.model.create(productDto);
  }

  async findAll(productFilterDto: ProductFilterDto) {
    const isElasticEnable = !!this.configService.get('ES_ENABLE');
    if (isElasticEnable) {
      if (productFilterDto.usingKnn) {
        return this.producerService.sendMessage(
          SEARCHING_PATTERN.SEARCH_PRODUCTS_USING_KNN,
          productFilterDto,
        );
      }
      return this.producerService.sendMessage(
        SEARCHING_PATTERN.SEARCH_PRODUCTS,
        productFilterDto,
      );
    }

    let { page } = productFilterDto;
    if (page < 1) {
      page = 1;
    }

    const data = await this.model
      .find()
      .sort({
        createdAt: -1,
      })
      .skip((page - 1) * ProductService.LIMIT)
      .limit(ProductService.LIMIT)
      .exec();
    const length = await this.model.countDocuments().exec();

    return {
      totalPage: Math.ceil(length / ProductService.LIMIT),
      currentPage: +page,
      data,
    };
  }

  async findOneWithES(id: string) {
    let existedInRedis = false,
      existedInES = false;

    // find redis first
    const redisProduct = await this.cacheService.getKey(`product:${id}`);
    if (redisProduct) {
      existedInRedis = true;
      return plainToInstance(Product, redisProduct);
    }

    // find ES next
    const ESProduct = await this.elasticsearchService.getProduct(id);
    if (ESProduct) {
      existedInES = true;

      if (!existedInRedis) {
        void this.saveToRedis(`product:${id}`, ESProduct);
      }

      return ESProduct;
    }

    // find in DB last
    const product = await this.findOne(id);

    if (!existedInRedis) {
      void this.saveToRedis(`product:${id}`, ESProduct);
    }

    if (!existedInES) {
      void this.elasticsearchService.createProduct(product);
    }

    return product;
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
    const savedProduct = await this.model.create({
      _id: product._id,
      ...productDto,
    });

    void this.deleteKeyFromRedis(`product:${productDto.productId}`);
    void this.saveToRedis(`product:${productDto.productId}`, savedProduct);

    void this.elasticsearchService.updateProduct(
      productDto.productId,
      savedProduct,
    );
  }

  async remove(deleteProductDto: DeleteProductDto) {
    const { id, user } = deleteProductDto;
    const seller = await this.findOne(id);
    if (seller._id.toString() !== user.shopId) {
      throw new RpcBadRequest('You do not have permission to do this');
    }

    void this.model.deleteOne({ id }).exec();

    void this.deleteKeyFromRedis(id);
    void this.elasticsearchService.deleteProduct(id);
    return null;
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
    // return this.brandModel.find().limit(10).exec();
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
    // return this.categoryModel.find().limit(10).exec();
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
  async createShop(createShopDto: CreateShopDto) {
    const { name, address, logo, description, user } = createShopDto;
    const slug = this.getSlugName(name);
    const createdShop = await this.shopModel.create({
      name,
      slug,
      url: `http://localhost:5173/shop/${slug}`,
      address,
      logo,
      description,
      approved: false,
    });

    user.shopId = createdShop._id.toString();
    await this.userRepo.save(user);
    return createdShop;
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

  async getAllShopsNotApproved() {
    return this.shopModel
      .find({ approved: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async approveShop(approveShopDto: ApproveShopDto) {
    const { shopId } = approveShopDto;
    const shop = await this.getShop(shopId);

    const user = await this.userRepo.findOneBy({ shopId });
    if (user) {
      user.role = Role.SHOP;
      await this.userRepo.save(user);
    }

    shop.approved = true;
    return this.shopModel.create(shop);
  }

  async findAllProductsOfShop(shopId: string) {
    return this.model.find({ seller: shopId }).exec();
  }

  private getSlugName(name: string): string {
    return slugify(name, {
      locale: 'vi',
      lower: true,
      trim: true,
    });
  }

  private saveToRedis<E>(key: string, document: E) {
    void this.cacheService.setKey(key, document);
  }

  private deleteKeyFromRedis(key: string) {
    void this.cacheService.delKey(key);
  }
}
