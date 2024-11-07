import { toast, TypeOptions } from 'react-toastify';

type Props = {
  type: TypeOptions;
  message: string | string[];
};

const useToast =
  () =>
  ({ type, message }: Props) => {
    if (typeof message === 'object') {
      message = message.join(', ');
    }
    toast(message, {
      type,
      position: 'top-right',
      autoClose: type === 'error' ? 5000 : 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      style: { zIndex: 999 },
    });
  };

export default useToast;
