import { IRatingImage } from './ratingImage.interface';
import { IRatingTimeline } from './ratingTimeline.interface';
import { IUser } from './user.interface';
import { IVoteAttribute } from './voteAttribute.interface';

export interface IRating {
  id: number;
  title: string;
  content: string;
  thankCount: number;
  userId: number;
  user?: IUser;
  commentCount: number;
  rating: number;
  images: IRatingImage[];
  productAttributes: string[];
  hadPhoto: boolean;
  productId: string;
  timeline: IRatingTimeline;
  voteAttributes: IVoteAttribute;
}
