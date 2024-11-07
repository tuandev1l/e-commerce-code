import Modal from 'react-modal';

type Props = {
  isModalOpen: boolean;
  closeModal: Function;
};

const customStyles = {
  content: {
    backgroundColor: 'transparent',
    border: 0,
  },
};

export const AddressModal = ({ isModalOpen, closeModal }: Props) => {
  const createNewAddress = () => {
    closeModal();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      style={customStyles}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      ariaHideApp={false}
    >
      <div className='max-w-lg mx-auto bg-white p-8 rounded-lg'>
        <h2 className='text-2xl font-semibold mb-6'>Tạo địa chỉ mới</h2>
        <form>
          {/* Full Name */}
          <div className='mb-4'>
            <label className='block text-gray-700'>Họ và tên:</label>
            <input
              type='text'
              placeholder='Trịnh Minh Tuấn BDCCN'
              className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Company */}
          <div className='mb-4'>
            <label className='block text-gray-700'>Công ty:</label>
            <input
              type='text'
              placeholder='Nhập công ty'
              className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Phone Number */}
          <div className='mb-4'>
            <label className='block text-gray-700'>Số điện thoại:</label>
            <input
              type='text'
              placeholder='Nhập số điện thoại'
              className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* City/Province */}
          <div className='mb-4'>
            <label className='block text-gray-700'>Tỉnh/Thành phố:</label>
            <select className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'>
              <option>Chọn Tỉnh/Thành phố</option>
              {/* Add options here */}
            </select>
          </div>

          {/* District */}
          <div className='mb-4'>
            <label className='block text-gray-700'>Quận huyện:</label>
            <select className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'>
              <option>Chọn Quận/Huyện</option>
              {/* Add options here */}
            </select>
          </div>

          {/* Ward */}
          <div className='mb-4'>
            <label className='block text-gray-700'>Phường xã:</label>
            <select className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'>
              <option>Chọn Phường/Xã</option>
              {/* Add options here */}
            </select>
          </div>

          {/* Address */}
          <div className='mb-4'>
            <label className='block text-gray-700'>Địa chỉ:</label>
            <textarea
              placeholder='Nhập địa chỉ'
              className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            ></textarea>
          </div>

          {/* Address Type */}
          <div className='mb-4'>
            <label className='block text-gray-700 mb-2'>Loại địa chỉ:</label>
            <div className='flex items-center gap-4'>
              <label className='flex items-center'>
                <input
                  type='radio'
                  name='addressType'
                  className='text-blue-500 focus:ring-blue-500'
                  defaultChecked
                />
                <span className='ml-2'>Nhà riêng / Chung cư</span>
              </label>
              <label className='flex items-center'>
                <input
                  type='radio'
                  name='addressType'
                  className='text-blue-500 focus:ring-blue-500'
                />
                <span className='ml-2'>Cơ quan / Công ty</span>
              </label>
            </div>
          </div>

          {/* Default Address Checkbox */}
          <div className='mb-6'>
            <label className='flex items-center'>
              <input
                type='checkbox'
                className='text-blue-500 focus:ring-blue-500'
              />
              <span className='ml-2'>Đặt làm địa chỉ mặc định</span>
            </label>
          </div>

          {/* Update Button */}
          <div className='text-center flex gap-2 justify-center'>
            <button
              className='bg-white text-black px-6 py-1 rounded focus:outline-none border-2 transition'
              onClick={() => closeModal()}
            >
              Trở lại
            </button>
            <button
              className='bg-blue-600 text-white px-6 py-1 rounded focus:outline-none transition'
              onClick={createNewAddress}
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
