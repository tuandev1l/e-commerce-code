import { ChangeEvent, CSSProperties, useEffect, useState } from 'react';
import useToast from '../../hook/useToast';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { usernameSelector } from '../../store/selector';
import axios from 'axios';
import { uploadFile } from '../../common/uploadFile';
import BeatLoader from 'react-spinners/BeatLoader';
import { Buffer } from 'buffer';

type Props = {
  image: string;
};

export interface ITryOn {
  model_path: string;
  cloth_path: string;
}

const ngrokUrl = 'https://ad52-34-134-184-73.ngrok-free.app';

const override: CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  borderColor: 'red',
};

export const TryOn = ({ image }: Props) => {
  const [modelImg, setModelImg] = useState<File>();
  const [modelPath, setModelPath] = useState<string>('');
  const [tryonImg, setTryonImg] = useState<string>('');
  const toast = useToast();
  const username = useSelector(usernameSelector);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let [isDisabled, setDisabled] = useState<boolean>(modelPath === '');

  useEffect(() => {
    setDisabled(modelPath === '');
  }, [modelPath]);

  const modelUploadHandeler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files?.length > 0) {
      const file = e.target.files[0];
      setModelImg(file);
      setModelPath(URL.createObjectURL(file));
    }
  };

  const { mutate } = useMutation({
    mutationKey: [`tryonUser/${username}`],
    mutationFn: (data: ITryOn) => axios.post(ngrokUrl, data),
    onSuccess: (data) => {
      setIsLoading(false);
      setDisabled(false);
      // @ts-ignore
      setTryonImg(data.data);
    },
    onError: () => {
      setIsLoading(false);
      setDisabled(false);
      toast({ type: 'error', message: 'Internal server error' });
    },
  });

  const removeBg = async () => {
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_url', image);

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': 'NP9tKb5N88kvFoXLFHBurCa4' },
      body: formData,
    });

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const blob = new Blob([Buffer.from(buffer)]);
      const imgUrl = await uploadFile(blob);
      return imgUrl;
    } else {
      toast({ type: 'error', message: 'Can not remove bg image' });
    }
  };

  const tryOnHandler = async () => {
    if (modelPath === '' || !modelImg) {
      return;
    }

    setTryonImg('');
    setIsLoading(true);
    setDisabled(true);
    const clothPath = await removeBg();
    const modelPathUpload = await uploadFile(modelImg);

    mutate({
      model_path: modelPathUpload,
      cloth_path: clothPath,
    });
  };

  return (
    <div className='col-span-4 bg-white p-6 rounded-lg mt-8'>
      <div className='font-bold text-lg flex gap-2 items-end'>
        <div className='text-2xl text-red-500'>MỚI: Thử đồ online</div>
      </div>
      <div>
        <ul className='list-disc list-inside'>
          <div className='my-2'>Chức năng cho phép bạn:</div>
          <li>Có thể thử đồ trực tiếp mà không cần đến shop</li>
          <li>
            Dễ dàng cảm nhận, trải nghiệm trước khi đưa ra quyết định mua đồ
          </li>
        </ul>
      </div>
      <div className='flex gap-12 mt-4 items-center'>
        {/* Model path */}
        <div className=''>
          <div className='mb-2 flex justify-center'>
            <label className='hover:cursor-pointer' htmlFor='file_input'>
              Tải lên ảnh chân dung
            </label>
          </div>
          <div className='mb-4'>
            {/* <img src={modelPath} /> */}
            <img
              src={modelPath}
              className='w-80 min-h-96 border-2 border-gray-200'
            />
          </div>
          <div className=''>
            <input
              className='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50'
              id='file_input'
              type='file'
              onChange={(e) => modelUploadHandeler(e)}
            />
          </div>
        </div>

        <div>
          <div className='flex mb-4 justify-center'>Ảnh quần áo muốn thử</div>
          <img src={image} className='w-80 h-80' />
        </div>

        <div className='relative'>
          <div className='flex mb-4 justify-center'>Kết quả</div>
          <img
            src={`${tryonImg ? `data:image/png;base64,${tryonImg}` : ''}`}
            className='w-80 min-h-96 border-2 border-gray-200'
          />
          <BeatLoader
            color={'red'}
            loading={isLoading}
            cssOverride={override}
            size={16}
            aria-label='Loading Spinner'
            data-testid='loader'
          />
        </div>
      </div>
      <button
        type='button'
        className={`text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2.5 me-2 mb-2 w-full mt-4 hover:cursor-pointer ${
          isDisabled &&
          'disabled bg-blue-300 hover:cursor-not-allowed hover:bg-blue-300'
        }`}
        disabled={isDisabled}
        onClick={tryOnHandler}
      >
        Try on
      </button>
    </div>
  );
};
