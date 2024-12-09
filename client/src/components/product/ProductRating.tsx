import { Rating } from 'react-simple-star-rating';
import { IRating } from '../../interfaces/rating.interface';
import moment from 'moment';
import { IRatingImage } from '../../interfaces/ratingImage.interface';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllRatingsOfProductApi } from '../../api/api';

type Props = {
  productId: string;
};

const fitlerBy = [
  'Tất cả',
  'Có hình ảnh',
  '5 sao',
  '4 sao',
  '3 sao',
  '2 sao',
  '1 sao',
];

export const ProductRating = ({ productId }: Props) => {
  const [ratings, setRatings] = useState<IRating[]>([]);
  const [selectedRating, setSelectedRating] = useState<IRating[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<number>(0);
  const [ratingImgs, setRatingImgs] = useState<IRatingImage[]>([]);

  const { data: ratingData } = useQuery({
    queryKey: [`product/ratingsOfProduct/${productId}`],
    queryFn: () => getAllRatingsOfProductApi(productId),
    enabled: !!productId,
    gcTime: 60 * 1000 * 3,
    staleTime: 60 * 1000 * 3,
  });

  useEffect(() => {
    if (ratingData) {
      // @ts-ignore
      setRatings(ratingData);
    }
  }, [ratingData]);

  const filterHandler = (idx: number) => {
    setSelectedNumber(idx);
    if (idx === 0) {
      setSelectedRating(ratings);
    } else if (idx === 1) {
      setSelectedRating(ratings.filter((rating) => rating.hadPhoto));
    } else {
      setSelectedRating(
        ratings.filter((rating) => rating.rating === 5 - idx + 2)
      );
    }
  };

  useEffect(() => {
    setSelectedRating(ratings);

    const imgs: IRatingImage[] = [];
    ratings.forEach((rating) => {
      imgs.push(...rating.images);
    });

    setRatingImgs(imgs);
  }, [ratings]);

  return (
    <>
      <div className='mt-4'>
        {ratingImgs.length > 0 && (
          <>
            <div className='mb-2'>Tất cả hình ảnh</div>
            <div className='flex gap-2 overflow-x-scroll'>
              {ratingImgs.map((img) => (
                <img src={img.fullPath} className='w-16' key={img.fullPath} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className='my-4'>
        <div className='mb-2'>Lọc theo</div>
        <div className='flex gap-4'>
          {fitlerBy.map((el, idx) => (
            <div
              className={`px-4 py-1 rounded-xl border-gray-200 border-2 ${
                idx === selectedNumber && 'border-blue-600'
              }`}
              key={el}
              onClick={() => filterHandler(idx)}
            >
              {el}
            </div>
          ))}
        </div>
      </div>
      {selectedRating.length > 0 ? (
        selectedRating.map((rating) => (
          <div key={rating.id} className='flex gap-8 items-start mb-8'>
            <div className='w-3/12'>
              <div className='flex items-center mt-4'>
                {/* Avatar */}
                <div className='rounded-full flex items-center justify-center text-gray-600 text-xl font-semibold'>
                  <img src={rating.user?.avatarUrl} className='w-12 h-12' />
                </div>
                <div className='ml-4'>
                  <p className='font-semibold'>{rating.user?.name}</p>
                  <p className='text-sm text-gray-500'>
                    Đã tham gia{' '}
                    {rating.user?.joinedTime ||
                      moment(rating.user?.createdAt).fromNow()}
                  </p>
                </div>
              </div>
              <div className='flex justify-between mt-4 text-sm items-end'>
                <div className='flex gap-4 items-end'>
                  <img
                    src='https://salt.tikicdn.com/ts/upload/c6/67/f1/444fc9e1869b5d4398cdec3682af7f14.png'
                    width={24}
                  />
                  <div className='text-gray-500'>Đã viết</div>
                </div>
                <div>{rating.user?.totalReview} Đánh giá</div>
              </div>
              <div className='flex justify-between mt-4 text-sm items-end'>
                <div className='flex gap-4 items-end'>
                  <img
                    src='https://salt.tikicdn.com/ts/upload/cc/86/cd/1d5ac6d4e00abbf6aa4e4636489c9d80.png'
                    width={24}
                  />
                  <div className='text-gray-500'>Đã nhận</div>
                </div>
                <div>{rating.user?.totalThank} Lượt cảm ơn</div>
              </div>
            </div>
            <div className='flex-1'>
              <div className='flex items-center gap-3'>
                <Rating
                  size={16}
                  readonly
                  transition
                  allowFraction
                  initialValue={rating.rating}
                  SVGclassName={'inline-block'}
                />
                <div className='font-semibold text-lg'>{rating.title}</div>
              </div>
              <p className='mt-4'>{rating.content}</p>
              {rating.images.length > 0 && (
                <div className='mt-4 w-36 rounded-lg flex gap-2 w-full overflow-x-scroll'>
                  {rating.images.map((img) => (
                    <img
                      src={img.fullPath}
                      className='w-32'
                      key={img.fullPath}
                    />
                  ))}
                </div>
              )}

              <div className='mt-4 text-gray-500'>
                {rating.productAttributes.map((attr) => (
                  <p key={attr}>{attr}</p>
                ))}
              </div>
              <button className='flex items-center text-blue-500 gap-2 mt-4'>
                <img
                  src='https://salt.tikicdn.com/ts/upload/10/9f/8b/54e5f6b084fb9e3445036b4646bc48b5.png'
                  width={20}
                />
                <span>Hữu ích</span>
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className='w-full flex h-32 justify-center items-center'>
          Không có đánh giá nào
        </div>
      )}
    </>
  );
};
