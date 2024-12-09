import { CameraIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import {
  cancelOrderApi,
  createRatingApi,
  deleteRatingApi,
  updateOrderStatusApi,
  updateRatingApi,
} from '../../api/api';
import { uploadFile } from '../../common/uploadFile';
import { IAxiosError } from '../../config/axiosError.interface';
import { ICreateRatingDto } from '../../dto/createRating.dto';
import { IUpdateRatingDto } from '../../dto/updateRating.dto';
import { ORDER_STATUS } from '../../enum';
import useToast from '../../hook/useToast';
import { IOrder, IOrderStatus } from '../../interfaces';
import { IRatingImage } from '../../interfaces/ratingImage.interface';
import { useAppDispatch } from '../../store/store';
import { cancelOrder, removeOrderRating } from './orderSlice';
import { useSelector } from 'react-redux';
import { roleSelector } from '../../store/selector';
import { Role } from '../../enum/role.user.enum';

type Props = {
  order: IOrder;
};

const convertOrderStatus = (orderStatus: ORDER_STATUS) => {
  switch (orderStatus) {
    case ORDER_STATUS.PENDING:
    case ORDER_STATUS.UNSUCCESSFUL:
      return 'Đơn hàng đang chờ thanh toán';
    case ORDER_STATUS.PREPARED:
      return 'Đơn hàng đang được người bán chuẩn bị';
    case ORDER_STATUS.SHIPPING:
      return 'Đơn hàng đang được vận chuyển';
    case ORDER_STATUS.COMPLETE:
      return 'Đơn hàng đã được giao thành công';
    case ORDER_STATUS.CANCEL:
      return 'Đơn hàng đã bị hủy';
  }
};

const convertRating = (rate: number) => {
  if (rate === 5) {
    return 'Cực kì hài lòng';
  } else if (rate >= 4) {
    return 'Hài lòng';
  } else if (rate >= 3) {
    return 'Bình thường';
  } else if (rate >= 2) {
    return 'Không hài lòng';
  }
  return 'Rất không hài lòng';
};

export const SelectedOrder = ({ order }: Props) => {
  const userRole = useSelector(roleSelector);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [commentShow, setCommentShow] = useState<boolean>(!!order.ratingId);
  const [edit, setEdit] = useState<boolean>(!order.ratingId);
  const [comment, setComment] = useState<string>(order?.rating?.content || '');
  const [rateNumber, setRateNumber] = useState<number>(
    order.rating?.rating || 5
  );
  const [files, setFiles] = useState<FileList>();
  const [previewImgs, setPreviewImgs] = useState<string[]>(
    order.rating?.images.map((img) => img.fullPath) || []
  );
  // code
  const location = useLocation().pathname;
  const isUserPage = location === '/order';
  const isStatisticPage = location.includes('statistic');

  const fileHandler = async (files: FileList | null) => {
    setEdit(true);
    if (files?.length && files?.length > 0) {
      setPreviewImgs([...files].map((file) => URL.createObjectURL(file)));
      setFiles(files);
    }
  };

  const { mutate } = useMutation({
    mutationKey: [`rating/${order.item._id}`],
    mutationFn: createRatingApi,
    onSuccess: () => {
      toast({ type: 'success', message: 'Create rating successfully' });
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  const { mutate: updateMutate } = useMutation({
    mutationKey: [`updateRating/${order.rating?.id}`],
    mutationFn: updateRatingApi,
    onSuccess: () => {
      toast({ type: 'success', message: 'Update rating successfully' });
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationKey: [`deleteRating/${order.rating?.id}`],
    mutationFn: deleteRatingApi,
    onSuccess: () => {
      toast({ type: 'success', message: 'Delete rating successfully' });
      setCommentShow(false);
      dispatch(removeOrderRating(order.id));
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  const deleteRatingHandler = () => {
    if (order.rating?.id) {
      deleteMutate(order.rating?.id);
    }
  };

  const ratingHandler = async () => {
    if (!edit) {
      setEdit(true);
      return;
    }

    let imgs: IRatingImage[] = [];

    if (files?.length && files.length > 0) {
      const fileUrls: string[] = await Promise.all(
        // @ts-ignore
        [...files].map((file) => uploadFile(file))
      );
      imgs = fileUrls.map((url) => ({
        fullPath: url,
        id: Math.random(),
        status: 'approved',
      }));
    }

    if (!order.rating?.id) {
      if (comment) {
        const rating: ICreateRatingDto = {
          content: comment,
          orderId: order.id,
          productAttributes: [order.item.color, order.item.size].filter(
            (el) => !!el
          ) as string[],
          productId: order.item._id,
          rating: rateNumber,
          title: convertRating(rateNumber),
          images: imgs,
        };
        mutate(rating);
      }
    } else {
      if (comment) {
        const rating: IUpdateRatingDto = {
          ratingId: order.rating?.id,
          content: comment,
          rating: rateNumber,
          title: convertRating(rateNumber),
          images: imgs,
        };
        updateMutate(rating);
      }
    }
  };

  const ratingStarHandler = (rate: number) => {
    setRateNumber(rate);
  };

  const uploadImageHandler = () => {};

  const { mutateAsync: completeOrderMutate } = useMutation({
    mutationKey: ['updateOrderStatus'],
    mutationFn: updateOrderStatusApi,
    onSuccess: () => {
      toast({ type: 'success', message: 'Update order successfully' });
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  const completeOrderHandler = async () => {
    const updateOrderStatus: IOrderStatus = {
      orderId: order.id,
      status: ORDER_STATUS.COMPLETE,
    };
    await completeOrderMutate(updateOrderStatus);
    order.status = ORDER_STATUS.COMPLETE;
  };

  const donePrepareHandler = async () => {
    const updateOrderStatus: IOrderStatus = {
      orderId: order.id,
      status: ORDER_STATUS.SHIPPING,
    };
    await completeOrderMutate(updateOrderStatus);
    order.status = ORDER_STATUS.SHIPPING;
  };

  const cancelOrderhandler = () => {
    if (confirm('Are you sure about that?')) {
      cancelMutate(order.id);
      dispatch(cancelOrder(order.id));
    }
  };

  const { mutate: cancelMutate } = useMutation({
    mutationKey: [`cancelOrder/${order.id}`],
    mutationFn: cancelOrderApi,
    onSuccess: () => {
      toast({ type: 'success', message: 'Cancel order successfully' });
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  return (
    <div
      key={order.item?.seller?._id}
      className={`p-4 pb-2 mb-4 rounded-lg ${
        isStatisticPage ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      {/* Order Status */}
      <div className='flex justify-between items-center border-b pb-2 mb-2'>
        <h3 className='font-semibold text-lg'>{order.item.seller?.name}</h3>
        <div className='text-green-500 flex items-center gap-2'>
          <span className='text-md'>{convertOrderStatus(order.status)}</span>{' '}
          {/* |<span className='text-md text-red-500'></span> */}
        </div>
      </div>

      <div className='flex justify-between items-center py-1 mb-4'>
        {/* Image and Product Info */}
        <div className='flex items-center w-1/2'>
          <img
            src={order.item.thumbnailUrl}
            alt={order.item.name}
            className='w-24 h-24 rounded-md mr-4'
          />
          <div>
            <p className='font-semibold'>{order.item.name}</p>
            <p className='text-gray-500 text-sm'>
              {order.item.color}, {order.item.size}
            </p>
            <div className='mt-1'>
              <button className='text-green-500 border border-green-500 text-xs px-2 py-0.5 rounded'>
                Trả hàng miễn phí 15 ngày
              </button>
            </div>
          </div>
        </div>

        {/* Price Column */}
        <div className='w-1/3 text-center flex gap-2 items-center justify-center'>
          <div className='text-red-500 font-semibold'>
            {order.item.price.toLocaleString()}₫
          </div>

          {order.item.discount ? (
            <div className='text-gray-500 line-through text-sm'>
              {order.item.originalPrice.toLocaleString()}₫
            </div>
          ) : (
            ''
          )}
          <div className='text-gray-500 font-semibold'>
            x{order.item.quantity}
          </div>
        </div>

        {/* Total Price Column */}
        <div className='w-32 text-center'>
          <div className='text-red-500 font-semibold'>
            {(order.item.price * order.item.quantity).toLocaleString()}₫
          </div>
        </div>

        {/* Delete Column */}
        {/* <div className='w-8 text-center flex justify-center items-center'>
          <TrashIcon
            width={24}
            className='text-gray-500 hover:text-red-500 cursor-pointer'
          />
        </div> */}
      </div>

      <div>
        <div>
          Đơn hàng được tạo ngày: {new Date(order.createdAt!).toLocaleString()}
        </div>
      </div>

      {/* Total and Action Buttons */}
      <div className='flex justify-between items-center mt-4 border-t pt-4 pb-2'>
        <div className='flex gap-4 justify-end w-full'>
          {userRole === Role.ADMIN ? (
            order.status === ORDER_STATUS.SHIPPING && (
              <div>
                <button
                  className='bg-red-500 text-white px-4 py-2 rounded'
                  onClick={completeOrderHandler}
                >
                  Đơn hàng đã giao
                </button>
              </div>
            )
          ) : order.status === ORDER_STATUS.PREPARED && !isUserPage ? (
            <div className='flex gap-3'>
              <button
                className='bg-red-500 text-white px-4 py-2 rounded'
                onClick={donePrepareHandler}
              >
                Chuẩn bị hàng xong
              </button>
            </div>
          ) : (
            !isStatisticPage &&
            userRole === Role.USER && (
              <div className='flex gap-3'>
                {order.status === ORDER_STATUS.COMPLETE &&
                  !order.ratingId &&
                  !commentShow && (
                    <button
                      className='bg-red-500 text-white px-4 py-2 rounded'
                      onClick={() => setCommentShow(true)}
                    >
                      Đánh giá
                    </button>
                  )}
                <Link to={`/product/${order.item._id}`}>
                  <button className='bg-red-500 text-white px-4 py-2 rounded'>
                    Mua Lại
                  </button>
                </Link>
                {order.status === ORDER_STATUS.PREPARED && (
                  <button
                    className='bg-red-500 text-white px-4 py-2 rounded'
                    onClick={cancelOrderhandler}
                  >
                    Hủy đơn hàng
                  </button>
                )}
                <button className='border border-gray-300 text-gray-700 px-4 py-2 rounded'>
                  Liên Hệ Người Bán
                </button>
              </div>
            )
          )}
        </div>
      </div>
      {commentShow && (
        <div>
          <div className='flex items-center gap-3'>
            <div>Chất lượng sản phẩm:</div>
            <Rating
              size={28}
              transition
              initialValue={rateNumber}
              readonly={!edit}
              SVGclassName={'inline-block'}
              onClick={ratingStarHandler}
            />
          </div>
          <div>
            <textarea
              id='message'
              rows={4}
              className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 my-2 outline-0'
              placeholder='Write your comment here...'
              readOnly={!edit}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className='flex gap-2'>
              {previewImgs.map((img) => (
                <img src={img} className='w-16 h-16' />
              ))}
            </div>
            <div className='flex my-3 justify-between'>
              <div className='bg-blue-200 rounded-xl hover:cursor-pointer flex items-center'>
                <input
                  type='file'
                  name='file'
                  hidden
                  id='file'
                  multiple
                  onChange={(e) => fileHandler(e.target.files)}
                />
                <label htmlFor='file'>
                  <div className='flex items-center gap-1 px-2 block'>
                    <div
                      className='hover:cursor-pointer'
                      onClick={uploadImageHandler}
                    >
                      <CameraIcon width={24} />
                    </div>
                    <div>Thêm hình ảnh</div>
                  </div>
                </label>
              </div>
              <div className='flex gap-2'>
                <button
                  type='button'
                  className='text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5'
                  onClick={ratingHandler}
                >
                  {!edit ? 'Chỉnh sửa' : 'Đánh giá'}
                </button>
                {order.rating?.id && (
                  <button
                    className='text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5'
                    onClick={deleteRatingHandler}
                  >
                    Xóa đánh giá
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
