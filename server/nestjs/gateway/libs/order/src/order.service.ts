import { Injectable } from '@nestjs/common';
import { Order } from '@libs/order/entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '@libs/order/entity/payment.entity';
import { Repository } from 'typeorm';
import { Shipping } from '@libs/order/entity/shipping.entity';
import { PaymentEnum, PaymentMethodEnum } from '@share/enums/payment.enum';
import { ShippingEnum } from '@share/enums/shipping.enum';
import { ORDER_STATUS } from '@libs/order/enum';
import { UpdateOrderStatusDto } from '@libs/order/dto/withUser/updateOrderStatus.dto';
import { User } from '@user/entities/user.entity';
import { CancelOrderDto } from '@libs/order/dto/withUser/cancelOrder.dto';
import { GetOrderDto } from '@libs/order/dto/withUser/getOrder.dto';
import { RpcBadRequest, RpcNotFound } from '@base/exception/exception.resolver';
import { BulkCreateOrderDto } from '@libs/order/dto/withUser/bulkCreateOrder.dto';
import { Role } from '@auth';
import { PayOrderDto } from '@libs/order/dto/withUser/payOrder.dto';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { VnpayService } from 'nestjs-vnpay';
import {
  dateFormat,
  generateRandomString,
  getDateInGMT7,
  ProductCode,
  VnpLocale,
} from 'vnpay';
import { Cart } from '@libs/cart/entity/cart.entity';

declare const Buffer;

@Injectable()
export class OrderService {
  private static readonly vnp_IpAddr = '13.160.92.202';
  private static readonly vnp_Version = '2.1.0';
  private static readonly vnp_Command = 'pay';
  private static readonly vnp_OrderType = 'other';
  private static readonly vnp_BankCode = 'VNBANK';
  private static readonly vnp_Locale = 'vn';
  private static readonly vnp_CurrCode = 'VND';

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Order) private readonly repository: Repository<Order>,
    @InjectRepository(Shipping)
    private readonly shippingRepo: Repository<Shipping>,
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    private readonly config: ConfigService,
    private readonly VnpayService: VnpayService,
  ) {}

  async getAllOrders(user: User) {
    return this.repository.find({
      where: { userId: user.id },
      relations: ['shipping', 'payment', 'rating'],
      order: {
        updatedAt: -1,
      },
    });
  }

  async getOrder(getOrderDto: GetOrderDto) {
    const { user, orderId } = getOrderDto;
    const order = await this.repository.findOne({
      where: {
        userId: user.id,
        id: orderId,
      },
      relations: ['shipping', 'payment'],
    });
    if (!order) {
      throw new RpcNotFound('There is no order with this ID');
    }
    return order;
  }

  async cancelOrder(orderPayload: CancelOrderDto) {
    const { user, orderId } = orderPayload;
    const order = await this.getOrder({ user, orderId });
    order.status = ORDER_STATUS.CANCEL;
    return this.repository.save(order);
  }

  async createOrder(orderPayload: BulkCreateOrderDto) {
    const { user } = orderPayload;
    if (user.role !== Role.USER) {
      throw new RpcBadRequest('Can not create order with this role');
    }

    const { paymentMethod, vnp_TransactionNo, vnp_TxnRef, orderInfo } =
      orderPayload;

    const uuid = orderInfo.split(':')[1];
    let status: ORDER_STATUS;

    const orders = await this.repository.findBy({ uuid });

    switch (paymentMethod) {
      case PaymentMethodEnum.VNPAY:
        const transactionStatus = await this.vnPaycheckPaymentStatus(
          vnp_TxnRef,
          vnp_TransactionNo,
          orderInfo,
        );
        if (`${transactionStatus}` === '00') {
          status = ORDER_STATUS.PREPARED;
        } else {
          status = ORDER_STATUS.UNSUCCESSFUL;
        }

        break;
      case PaymentMethodEnum.STRIPE:
        break;
      case PaymentMethodEnum.MOMO:
        break;
    }

    const cart = await this.cartRepository.findOneBy({ userId: user.id });
    let productItems = cart.productItems;
    // console.log(`Initial: ${productItems}`);
    const newOrders = orders.map((order) => {
      productItems = productItems.filter(
        (item) => item.uuid !== order.item.uuid,
      );
      // console.log(`uuid: ${order.uuid}`);
      // console.log(`filter: ${productItems}`);
      order.status = status;
      // @ts-ignore
      order.shopId = order.item.seller._id;
      return order;
    });

    cart.productItems = productItems;
    // console.log(`After: ${cart.productItems}`);

    await this.cartRepository.save(cart);
    return this.repository.save(newOrders);
  }

  async vnPaycheckPaymentStatus(
    vnp_TxnRef: string,
    vnp_TransactionNo: number,
    vnp_OrderInfo: string,
  ) {
    const date = dateFormat(getDateInGMT7(new Date()));

    const data = await this.VnpayService.queryDr({
      vnp_IpAddr: OrderService.vnp_IpAddr,
      vnp_TxnRef,
      vnp_TransactionNo,
      vnp_OrderInfo,
      vnp_TransactionDate: date,
      vnp_CreateDate: date,
      vnp_RequestId: generateRandomString(16),
    });

    return data.vnp_ResponseCode;
  }

  async createPayment(payments: { name: string; imgUrl: string }[]) {
    const isPaymentExisted = await this.paymentRepo.find();
    if (isPaymentExisted.length > 0) {
      return;
    }

    const paymentEntities = payments.map((payment) => {
      return this.paymentRepo.create({
        method: payment.name,
        imgUrl: payment.imgUrl,
        status: PaymentEnum.AVAILABLE,
        description: `Thanh toán thông qua cổng ${payment}`,
        isPrepaid: true,
      });
    });

    void this.paymentRepo.save(paymentEntities);
  }

  async createShippingMethod(
    shippingMethods: { name: string; imgUrl: string }[],
  ) {
    const isShippingMethodExisted = await this.shippingRepo.find();
    if (isShippingMethodExisted.length > 0) {
      return;
    }

    const shippingEntities = shippingMethods.map((shipping) => {
      return this.shippingRepo.create({
        partnerName: shipping.name,
        imgUrl: shipping.imgUrl,
        status: ShippingEnum.AVAILABLE,
      });
    });

    void this.shippingRepo.save(shippingEntities);
  }

  async updateOrderStatus(updateOrderStatusDto: UpdateOrderStatusDto) {
    const { orderId, status, user } = updateOrderStatusDto;
    const order = await this.repository.findOneBy({ id: orderId });
    if (!order) {
      throw new RpcNotFound('There is no order with this ID');
    }

    if (user.role === Role.SHOP && order.status !== ORDER_STATUS.PREPARED) {
      throw new RpcBadRequest('Insufficient permission');
    }

    order.status = status;

    return this.repository.save(order);
  }

  async getAllShippingMethod() {
    return this.shippingRepo.find();
  }

  async getAllPaymentMethod() {
    return this.paymentRepo.find();
  }

  async getShippingMethod(id: number) {
    const shippingMethod = this.shippingRepo.findOneBy({ id });
    if (!shippingMethod) {
      throw new RpcNotFound('There is no shipping with this ID');
    }
    return shippingMethod;
  }

  async getPaymentMethod(id: number) {
    const paymentMethod = this.paymentRepo.findOneBy({ id });
    if (!paymentMethod) {
      throw new RpcNotFound('There is no payment with this ID');
    }
    return paymentMethod;
  }

  async payOrder(payOrderDto: PayOrderDto) {
    const { orders, user } = payOrderDto;

    let paymentId: number, paymentUrl: string;

    const uuid = uuidv4().toString();
    switch (payOrderDto.paymentMethod) {
      case PaymentMethodEnum.VNPAY:
        paymentId = 3;
        paymentUrl = await this.vnpayHandler(payOrderDto.amount, uuid);
        break;
      case PaymentMethodEnum.MOMO:
        paymentId = 2;
        break;
      case PaymentMethodEnum.STRIPE:
        paymentId = 1;
        break;
      default:
        throw new RpcBadRequest('This payment method is not supported');
    }

    const orderEntities = orders.map((order) => {
      return this.repository.create({
        status: ORDER_STATUS.PENDING,
        uuid,
        invoice: order.invoice,
        shippingId: order.shippingId,
        paymentId,
        item: order.item,
        statusHistories: [],
        userId: user.id,
      });
    });

    await this.repository.save(orderEntities);

    return {
      status: 'success',
      paymentUrl,
    };
  }

  async getAllOrdersForAdmin() {
    return this.repository
      .createQueryBuilder('order')
      .where(`order.status=:shipping`, {
        shipping: ORDER_STATUS.SHIPPING,
      })
      .orderBy('order.createdAt', 'DESC')
      .getMany();
  }

  async getAllOrdersPreparedForShop(shopId: string) {
    return this.repository.findBy({ shopId, status: ORDER_STATUS.PREPARED });
  }

  async getAllOrdersForShop(shopId: string) {
    return this.repository.findBy({ shopId });
  }

  private async vnpayHandler(amount: number, uuid: string) {
    const date = new Date();

    const orderId = moment(date).format('DDHHmmss');
    return this.VnpayService.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: OrderService.vnp_IpAddr,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan cho ma GD:${uuid}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: this.config.get('vnp_ReturnUrl'),
      vnp_Locale: VnpLocale.VN,
      vnp_BankCode: OrderService.vnp_BankCode,
    });
    //
    // const secretKey = this.config.get('vnp_HashSecret');
    // let vnpUrl = this.config.get('vnp_Url');
    // const returnUrl = 'http://localhost:5173/vnpay-payment';
    //
    // const vnp_Params = {};
    // vnp_Params['vnp_Version'] = OrderService.vnp_Version;
    // vnp_Params['vnp_Command'] = OrderService.vnp_Command;
    // vnp_Params['vnp_TmnCode'] = this.config.get('vnp_TmnCode');
    // vnp_Params['vnp_Locale'] = OrderService.vnp_Locale;
    // vnp_Params['vnp_CurrCode'] = OrderService.vnp_CurrCode;
    // vnp_Params['vnp_TxnRef'] = orderId;
    // vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + uuid;
    // vnp_Params['vnp_OrderType'] = OrderService.vnp_OrderType;
    // vnp_Params['vnp_Amount'] = amount * 100;
    // vnp_Params['vnp_ReturnUrl'] = returnUrl;
    // vnp_Params['vnp_IpAddr'] = OrderService.vnp_IpAddr;
    // vnp_Params['vnp_CreateDate'] = createDate;
    // vnp_Params['vnp_BankCode'] = OrderService.vnp_BankCode;
    //
    // const vnp_ParamsSorted = this.sortObject(vnp_Params);
    // const signData = querystring.stringify(vnp_ParamsSorted, { encode: false });
    // const hmac = crypto.createHmac('sha512', secretKey);
    // vnp_Params['vnp_SecureHash'] = hmac
    //   .update(Buffer.from(signData, 'utf-8'))
    //   .digest('hex');
    // vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    //
    // return vnpUrl;
  }

  private sortObject(obj: object) {
    const sorted = {};
    const str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }

  private VNPayBodyOrderStatus(
    vnp_OrderInfo: string,
    vnp_TransactionDate: string,
    vnp_TxnRef: string,
  ) {
    const date = new Date();
    const vnp_RequestId = moment(date).format('HHmmss');
    const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
    const vnp_Command = 'querydr';

    const data =
      vnp_RequestId +
      '|' +
      OrderService.vnp_Version +
      '|' +
      OrderService.vnp_Command +
      '|' +
      this.config.get('vnp_TmnCode') +
      '|' +
      vnp_TxnRef +
      '|' +
      vnp_TransactionDate +
      '|' +
      vnp_CreateDate +
      '|' +
      OrderService.vnp_IpAddr +
      '|' +
      vnp_OrderInfo;

    console.log(data);

    const secretKey = this.config.get('vnp_HashSecret');
    const hmac = crypto.createHmac('sha512', secretKey);
    const vnp_SecureHash = hmac
      .update(Buffer.from(data, 'utf-8'))
      .digest('hex');

    const body: { [key: string]: string } = {
      vnp_RequestId,
      vnp_Version: OrderService.vnp_Version,
      vnp_Command,
      vnp_TmnCode: this.config.get('vnp_TmnCode'),
      vnp_TxnRef,
      vnp_OrderInfo: vnp_OrderInfo,
      vnp_TransactionDate: vnp_TransactionDate,
      vnp_CreateDate,
      vnp_IpAddr: OrderService.vnp_IpAddr,
      vnp_SecureHash,
    };

    return body;
  }
}
