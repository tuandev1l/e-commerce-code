import { InventoryStatusEnum } from '../../enum';
import { IProduct } from '../../interfaces';

export interface IProductSlice {
  isLoading: boolean;
  products: IProduct[];
  product: IProduct;
  error?: string;
}

export const productDefault: IProduct = {
  _id: 'abc',
  name: 'áo khoác nỉ nữ NÓN 2 LỚP phong cách cực cute THÊU GẤU HOT TREND 2022, áo khoác Nỉ kéo khoá thêu hình gấu 2 nón, Áo Khoác Nỉ Khoá Kéo Hình Gấu Unisex Mặc Ấm, Áo KHOÁC NỈ thêu Gấu CHẤt nỉ cotton dày dặn có lót lông',
  shortDescription:
    'NAM NỮ COUPLE ĐỀU MẶC ĐƯỢC, HÀNG BÁN SHOP STORE DÀY DẶN HÌNH THẬT (ĐỪNG SO SÁNH VỚI HÀNG GIÁ RẺ NHÉ KHÁCH ƠI!!!)* Chất liệu: Nhung tăm cao cấp mềm mịn, co giản tốt, from chuẩn, không xù, thấm hút mồ ...',
  price: 109000,
  listPrice: 109000,
  originalPrice: 109000,
  badges: [
    {
      code: 'return_policy',
      type: 'pdp_icon_badge',
      index: 3,
      icon: 'https://salt.tikicdn.com/ts/ta/b1/3f/4e/cc3d0a2dd751a7b06dd97d868d6afa56.png',
      iconWidth: 114,
      iconHeight: 20,
      textColor: undefined,
      backgroundColor: undefined,
    },
  ],
  discount: 0,
  discountRate: 0,
  ratingAverage: 4.3,
  reviewCount: 47,
  reviewText: '(47)',
  favouriteCount: 0,
  thumbnailUrl:
    'https://salt.tikicdn.com/cache/280x280/ts/product/82/06/96/dd757eaddd58b229715fbb066213c967.jpg',
  inventoryStatus: InventoryStatusEnum.AVAILABLE,
  allTimeQuantitySold: 172,
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  description:
    '<p><strong>NAM NỮ COUPLE ĐỀU MẶC ĐƯỢC, HÀNG BÁN SHOP STORE DÀY DẶN HÌNH THẬT (ĐỪNG SO SÁNH VỚI HÀNG GIÁ RẺ NHÉ KHÁCH ƠI!!!)</strong></p>\n<p>* Chất liệu: Nhung tăm cao cấp mềm mịn, co giản tốt, from chuẩn, không xù, thấm hút mồ hôi tốt, tạo cảm giác thoải mái và thông thoáng cho người mặc.</p>\n<p><strong>* </strong>Được thiết kế mang phong cách thời trang thời thượng. Mẫu áo hoodie này không chỉ giúp bạn giữ ấm trong mùa lạnh mà còn có thể chống nắng, chống gió, chống bụi, chống rét, chống tia UV cực tốt, rất tiện lợi nhé!!! (Được sử dụng nhiều trong dịp Lễ hội, Đi chơi, Da ngoại, Dạo phố, Du lịch)</p>\n<ul><li>Form: Form rộng mang lại sự thoải mái, trẻ trung.</li><li>Chất lượng: sản phẩm tốt, giá cả hợp lý.</li><li>Kiểu dáng: Thiết kế đơn giản, dễ mặc, dễ phối đồ.</li></ul><p>Giá sản phẩm trên Tiki đã bao gồm thuế theo luật hiện hành. Bên cạnh đó, tuỳ vào loại sản phẩm, hình thức và địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như phí vận chuyển, phụ phí hàng cồng kềnh, thuế nhập khẩu (đối với đơn hàng giao từ nước ngoài có giá trị trên 1 triệu đồng).....</p>',
  images: [
    {
      baseUrl:
        'https://salt.tikicdn.com/ts/product/82/06/96/dd757eaddd58b229715fbb066213c967.jpg',
      isGallery: true,
      largeUrl:
        'https://salt.tikicdn.com/cache/w1200/ts/product/82/06/96/dd757eaddd58b229715fbb066213c967.jpg',
      mediumUrl:
        'https://salt.tikicdn.com/cache/w300/ts/product/82/06/96/dd757eaddd58b229715fbb066213c967.jpg',
      position: null,
      smallUrl:
        'https://salt.tikicdn.com/cache/200x280/ts/product/82/06/96/dd757eaddd58b229715fbb066213c967.jpg',
      thumbnailUrl:
        'https://salt.tikicdn.com/cache/200x280/ts/product/82/06/96/dd757eaddd58b229715fbb066213c967.jpg',
    },
    {
      baseUrl:
        'https://salt.tikicdn.com/ts/product/82/06/96/df9880cedb5135a9978bc157b81f8c94.jpg',
      isGallery: true,
      largeUrl:
        'https://salt.tikicdn.com/cache/w1200/ts/product/82/06/96/df9880cedb5135a9978bc157b81f8c94.jpg',
      mediumUrl:
        'https://salt.tikicdn.com/cache/w300/ts/product/82/06/96/df9880cedb5135a9978bc157b81f8c94.jpg',
      position: null,
      smallUrl:
        'https://salt.tikicdn.com/cache/200x280/ts/product/82/06/96/df9880cedb5135a9978bc157b81f8c94.jpg',
      thumbnailUrl:
        'https://salt.tikicdn.com/cache/200x280/ts/product/82/06/96/df9880cedb5135a9978bc157b81f8c94.jpg',
    },
    {
      baseUrl:
        'https://salt.tikicdn.com/ts/product/9e/e6/36/06e1a76a69f2220ce4b1af3c5b644eb3.jpg',
      isGallery: true,
      largeUrl:
        'https://salt.tikicdn.com/cache/w1200/ts/product/9e/e6/36/06e1a76a69f2220ce4b1af3c5b644eb3.jpg',
      mediumUrl:
        'https://salt.tikicdn.com/cache/w300/ts/product/9e/e6/36/06e1a76a69f2220ce4b1af3c5b644eb3.jpg',
      position: null,
      smallUrl:
        'https://salt.tikicdn.com/cache/200x280/ts/product/9e/e6/36/06e1a76a69f2220ce4b1af3c5b644eb3.jpg',
      thumbnailUrl:
        'https://salt.tikicdn.com/cache/200x280/ts/product/9e/e6/36/06e1a76a69f2220ce4b1af3c5b644eb3.jpg',
    },
    {
      baseUrl:
        'https://salt.tikicdn.com/ts/product/5f/5b/e6/f9d7b4f791703c87c8f1f756e3caa029.jpg',
      isGallery: true,
      largeUrl:
        'https://salt.tikicdn.com/cache/w1200/ts/product/5f/5b/e6/f9d7b4f791703c87c8f1f756e3caa029.jpg',
      mediumUrl:
        'https://salt.tikicdn.com/cache/w300/ts/product/5f/5b/e6/f9d7b4f791703c87c8f1f756e3caa029.jpg',
      position: null,
      smallUrl:
        'https://salt.tikicdn.com/cache/200x280/ts/product/5f/5b/e6/f9d7b4f791703c87c8f1f756e3caa029.jpg',
      thumbnailUrl:
        'https://salt.tikicdn.com/cache/200x280/ts/product/5f/5b/e6/f9d7b4f791703c87c8f1f756e3caa029.jpg',
    },
    {
      baseUrl:
        'https://salt.tikicdn.com/ts/product/ff/3d/cf/45c572151e470bf99318bf3f00f0d8cf.jpg',
      isGallery: true,
      largeUrl:
        'https://salt.tikicdn.com/cache/w1200/ts/product/ff/3d/cf/45c572151e470bf99318bf3f00f0d8cf.jpg',
      mediumUrl:
        'https://salt.tikicdn.com/cache/w300/ts/product/ff/3d/cf/45c572151e470bf99318bf3f00f0d8cf.jpg',
      position: null,
      smallUrl:
        'https://salt.tikicdn.com/cache/200x280/ts/product/ff/3d/cf/45c572151e470bf99318bf3f00f0d8cf.jpg',
      thumbnailUrl:
        'https://salt.tikicdn.com/cache/200x280/ts/product/ff/3d/cf/45c572151e470bf99318bf3f00f0d8cf.jpg',
    },
    {
      baseUrl:
        'https://salt.tikicdn.com/ts/product/09/f3/56/51dc9b9f2097d211ae27d1c2aca7a0de.jpg',
      isGallery: true,
      largeUrl:
        'https://salt.tikicdn.com/cache/w1200/ts/product/09/f3/56/51dc9b9f2097d211ae27d1c2aca7a0de.jpg',
      mediumUrl:
        'https://salt.tikicdn.com/cache/w300/ts/product/09/f3/56/51dc9b9f2097d211ae27d1c2aca7a0de.jpg',
      position: null,
      smallUrl:
        'https://salt.tikicdn.com/cache/200x280/ts/product/09/f3/56/51dc9b9f2097d211ae27d1c2aca7a0de.jpg',
      thumbnailUrl:
        'https://salt.tikicdn.com/cache/200x280/ts/product/09/f3/56/51dc9b9f2097d211ae27d1c2aca7a0de.jpg',
    },
  ],
  brand: {
    id: '740219',
    name: 'Jinrinteen',
    slug: 'jinrinteen',
  },
  seller: {
    id: '43788',
    name: 'jinshopteen',
    logo: '86/37/30/dad40ce1c1272b134776f8568513c792.jpg',
    url: '',
  },
  specifications: [
    {
      name: 'Content',
      attributes: [
        {
          code: 'brand',
          name: 'Thương hiệu',
          value: 'Jinrinteen',
        },
        {
          code: 'origin',
          name: 'Xuất xứ (Made in)',
          value: 'Việt Nam',
        },
      ],
    },
    {
      name: 'Operation',
      attributes: [
        {
          code: 'is_warranty_applied',
          name: 'Sản phẩm có được bảo hành không?',
          value: 'Không',
        },
      ],
    },
  ],
  configurableOptions: [
    {
      code: 'option1',
      name: 'Màu',
      position: 0,
      showPreviewImage: true,
      values: [
        {
          label: 'HỒNG',
        },
        {
          label: 'TRẮNG KEM',
        },
        {
          label: 'Xanh',
        },
        {
          label: 'Đen',
        },
      ],
    },
    {
      code: 'option2',
      name: 'SIZE',
      position: 0,
      showPreviewImage: false,
      values: [
        {
          label: 'FreeSize: 40kg--->70kg',
        },
      ],
    },
  ],
  highlight: {
    items: [
      'Chất liệu nhung tăm cao cấp mềm mịn, co giãn tốt, không xù, thấm hút mồ hôi tốt.',
      'Thiết kế phong cách thời trang thời thượng, giữ ấm, chống nắng, chống gió, chống bụi.',
      'Sản phẩm tốt, giá cả hợp lý.',
    ],
    title: 'Đặc điểm nổi bật',
  },
  stockItem: {
    maxSaleQty: 1000,
    minSaleQty: 1,
    qty: 1000,
  },
  quantitySold: {
    text: 'Đã bán 172',
    value: 172,
  },
  categories: {
    id: '931',
    name: 'Thời trang nữ',
    slug: 'thoi-trang-nu',
  },
  isSellerInChatWhitelist: true,
  warrantyInfo: [
    {
      name: 'Hướng dẫn bảo hành',
      value: 'Xem chi tiết',
      url: 'https://hotro.tiki.vn/s/article/chinh-sach-bao-hanh-tai-tiki-nhu-the-nao',
    },
  ],
  returnAndExchangePolicy: ' Đổi trả trong<br><b>7 ngày</b><br>nếu sp lỗi.',
  benefits: [
    {
      icon: 'https://salt.tikicdn.com/ts/upload/c5/37/ee/76c708d43e377343e82baee8a0340297.png',
      text: 'Được đồng kiểm khi nhận hàng',
    },
    {
      icon: 'https://salt.tikicdn.com/ts/upload/ea/02/b4/b024e431ec433e6c85d4734aaf35bd65.png',
      text: '<b>Được hoàn tiền 200%</b> nếu là hàng giả.',
    },
    {
      icon: 'https://salt.tikicdn.com/ts/upload/d8/c7/a5/1cd5bd2f27f9bd74b2c340b8e27c4d82.png',
      text: 'Đổi trả miễn phí trong 30 ngày. Được đổi ý.',
      subText: [],
    },
  ],
  returnPolicy: {
    body: [
      {
        label: '',
        content: [
          'Được đổi ý (sản phẩm phải còn nguyên hộp, tem, phụ kiện, chưa kích hoạt bảo hành, không áp dụng đơn hàng trả góp), hoặc',
          'Sản phẩm không đúng cam kết (lỗi kỹ thuật, giao sai/thiếu, bể vỡ…)',
        ],
      },
    ],
    title: 'Đổi trả miễn phí trong 30 ngày',
  },
};

export const productInitialState: IProductSlice = {
  isLoading: false,
  products: [],
  product: productDefault,
  error: '',
};
