import { ChangeEvent, useEffect, useState } from 'react';
import { ShopAdminLayout } from './ShopAdminLayout';
import { IOrder } from '../../interfaces';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { shopIdSelector } from '../../store/selector';
import { getAllOrdersForShopApi } from '../../api/api';
import { ORDER_STATUS } from '../../enum';
import { priceSplit } from '../../common/price/priceSplit';
import moment from 'moment';
import { ShopAdminReport } from './ShopAdminReport';
import { SelectedOrder } from '../order/SelectedOrder';

type Props = {};

export interface IReport {
  [key: string | number]: number;
}

export enum StatisticType {
  'WEEK' = 'WEEK',
  'MONTH' = 'MONTH',
  'YEAR' = 'YEAR',
}

let realMoney = 0;
let notPaidYetMoney = 0;
let moneyOfWeek = 0;
let moneyOfMonth = 0;
let moneyOfYear = 0;
let cancelMoney = 0;

const today = moment();
const startOfWeek = today.clone().startOf('week');
const endOfWeek = today.clone().endOf('week');
const startOfMonth = today.clone().startOf('month');
const endOfMonth = today.clone().endOf('month');
const startOfYear = today.clone().startOf('year');
const endOfYear = today.clone().endOf('year');

const reportByWeek = () => {
  let day = startOfWeek.clone();
  const data: IReport = {};
  while (day.isSameOrBefore(endOfWeek)) {
    data[day.date()] = 0;
    day = day.add(1, 'day');
  }
  return data;
};

const reportByMonth = () => {
  let day = startOfMonth.clone();
  const data: IReport = {};
  while (day.isSameOrBefore(endOfMonth)) {
    data[day.date()] = 0;
    day = day.add(1, 'day');
  }
  return data;
};

const reportByYear = () => {
  let day = startOfYear.clone();
  const data: IReport = {};
  while (day.isSameOrBefore(endOfYear)) {
    data[day.month() + 1] = 0;
    day = day.add(1, 'month');
  }
  return data;
};

export const ShopAdminStatistic = ({}: Props) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [dataReport, setDataReport] = useState<IReport>({});
  const shopId = useSelector(shopIdSelector);

  const { data } = useQuery({
    queryKey: [`getAllOrdersOfShop/${shopId}`],
    queryFn: () => getAllOrdersForShopApi(shopId),
    enabled: !!shopId,
  });

  useEffect(() => {
    if (data) {
      // @ts-ignore
      setOrders(data);
      const dataReport = reportByWeek();

      (data as unknown as IOrder[]).forEach((order) => {
        const price = order.item.quantity * order.item.price;
        const createOrder = moment(order.createdAt);

        dataReport[createOrder.date()] += 1;

        if (
          order.status === ORDER_STATUS.PENDING ||
          order.status === ORDER_STATUS.UNSUCCESSFUL
        ) {
          notPaidYetMoney += price;
        } else if (order.status === ORDER_STATUS.CANCEL) {
          cancelMoney += price;
        } else {
          realMoney += price;
          if (
            createOrder.isSameOrAfter(startOfWeek) &&
            createOrder.isSameOrBefore(endOfWeek)
          ) {
            moneyOfWeek += price;
          }

          if (
            createOrder.isSameOrAfter(startOfMonth) &&
            createOrder.isSameOrBefore(endOfMonth)
          ) {
            moneyOfMonth += price;
          }

          if (
            createOrder.isSameOrAfter(startOfYear) &&
            createOrder.isSameOrBefore(endOfYear)
          ) {
            moneyOfYear += price;
          }
        }
      });

      setDataReport(dataReport);
    }
  }, [data]);

  useEffect(() => {});

  const selectChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    let dataReport: IReport;

    if (value === StatisticType.WEEK) {
      dataReport = reportByWeek();
    } else if (value === StatisticType.MONTH) {
      dataReport = reportByMonth();
    } else {
      dataReport = reportByYear();
    }

    switch (value) {
      case StatisticType.WEEK:
      case StatisticType.MONTH:
        (data as unknown as IOrder[]).forEach((order) => {
          const createOrder = moment(order.createdAt);
          dataReport[createOrder.date()] += 1;
        });
        break;
      case StatisticType.YEAR:
        (data as unknown as IOrder[]).forEach((order) => {
          const createOrder = moment(order.createdAt);
          dataReport[createOrder.month() + 1] += 1;
        });
        break;
    }

    setDataReport(dataReport);
  };

  return (
    <ShopAdminLayout>
      <div>
        <div className='bg-white py-6 px-4 rounded-md'>
          <div className='font-bold text-xl mb-4'>Tổng quan</div>
          <div className='grid grid-cols-3 gap-12 text-right'>
            <div className=''>
              <div className=''>Đã thanh toán trong tuần</div>
              <div className='font-bold text-2xl'>
                {priceSplit(moneyOfWeek)}
              </div>
            </div>
            <div className=''>
              <div className=''>Đã thanh toán trong tháng</div>
              <div className='font-bold text-2xl'>
                {priceSplit(moneyOfMonth)}
              </div>
            </div>
            <div className=''>
              <div className=''>Đã thanh toán năm {today.year()}</div>
              <div className='font-bold text-2xl'>
                {priceSplit(moneyOfYear)}
              </div>
            </div>
          </div>
          <div className='grid grid-cols-3 text-right gap-12 mt-4'>
            <div className=''>
              <div className=''>Tổng đã thanh toán</div>
              <div className='font-bold text-2xl'>{priceSplit(realMoney)}</div>
            </div>
            <div className=''>
              <div className=''>Chưa thanh toán</div>
              <div className='font-bold text-2xl'>
                {priceSplit(notPaidYetMoney)}
              </div>
            </div>
            <div className=''>
              <div className=''>Trả hàng / Hoàn tiền xử lý</div>
              <div className='font-bold text-2xl'>
                {priceSplit(notPaidYetMoney)}
              </div>
            </div>
          </div>
        </div>
        <div className='bg-white py-6 px-4 rounded-md mt-4'>
          <div>
            <div className='font-bold text-xl mb-4'>Thống kê chi tiết</div>
            <form className='w-64'>
              <select
                id='type'
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full'
                onChange={(e) => selectChangeHandler(e)}
              >
                <option value={StatisticType.WEEK}>Tuần này</option>
                <option value={StatisticType.MONTH}>Tháng này</option>
                <option value={StatisticType.YEAR}>Năm nay</option>
              </select>
            </form>
            <div className='mt-4'>
              <ShopAdminReport dataReport={dataReport} />
            </div>
          </div>
        </div>
        <div className='bg-white py-6 px-4 rounded-md mt-4'>
          <div className='font-bold text-xl mb-4'>Chi tiết các đơn hàng</div>
          <div className='max-h-96 overflow-y-scroll'>
            {orders.map((order) => (
              <SelectedOrder order={order} />
            ))}
          </div>
        </div>
      </div>
    </ShopAdminLayout>
  );
};
