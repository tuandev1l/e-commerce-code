import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestSignupApi } from '../../api/api';
import { AuthBox } from '../../common/auth/AuthBox';
import { BoxWrapper } from '../../common/auth/BoxWrapper';
import { Layout } from '../../common/layout/Layout';
import { IAxiosError } from '../../config/axiosError.interface';
import useToast from '../../hook/useToast';
import { ISignup, signupDefault } from '../../interfaces/signup.interface';

type Props = {};

export const Signup = ({}: Props) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState<ISignup>(signupDefault);

  const { mutate } = useMutation({
    mutationKey: ['auth/signup'],
    mutationFn: requestSignupApi,
    onSuccess: () => {
      toast({
        type: 'success',
        message: 'Signup successfully, please verify email before login',
      });
      setTimeout(() => {
        navigate('/');
      }, 1000);
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  const submitHandler = () => {
    const isNotValid = Object.values(formData).some((value) => !value);
    if (isNotValid) {
      toast({ type: 'error', message: 'Missing field' });
      return;
    }
    mutate(formData);
  };

  return (
    <Layout>
      <AuthBox>
        <>
          <div className='w-full bg-white md:mt-0 xl:p-0 dark:border-gray-700'>
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
              <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl '>
                Sign up to your account
              </h1>
              <div className='space-y-4 md:space-y-6'>
                <div className='flex w-full gap-4'>
                  <BoxWrapper>
                    <>
                      <label
                        htmlFor='email'
                        className='block mb-2 text-sm font-medium text-gray-900 '
                      >
                        Your email
                      </label>
                      <input
                        type='text'
                        name='email'
                        id='email'
                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:border-blue-500'
                        placeholder='name@company.com'
                        required={true}
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </>
                  </BoxWrapper>
                  <BoxWrapper>
                    <div>
                      <label
                        htmlFor='name'
                        className='block mb-2 text-sm font-medium text-gray-900 '
                      >
                        Your name
                      </label>
                      <input
                        type='text'
                        name='name'
                        id='name'
                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:border-blue-500'
                        placeholder='Nguyễn Văn A'
                        required={true}
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                  </BoxWrapper>
                </div>
                <div className='flex gap-4'>
                  <div className='flex flex-col flex-1 justify-start gap-5'>
                    <div>
                      <label
                        htmlFor='phone'
                        className='block mb-2 text-sm font-medium text-gray-900 '
                      >
                        Your phone
                      </label>
                      <input
                        type='tel'
                        name='phone'
                        id='phone'
                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:border-blue-500'
                        defaultValue='0987654321'
                        required={true}
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='birthday'
                        className='block mb-2 text-sm font-medium text-gray-900 '
                      >
                        Your birthday
                      </label>
                      <input
                        type='date'
                        name='birthday'
                        id='birthday'
                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:border-blue-500'
                        defaultValue='1970-01-01'
                        min={'1900-01-01'}
                        required={true}
                        value={formData.birthday}
                        onChange={(e) =>
                          setFormData({ ...formData, birthday: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='gender'
                        className='block mb-2 text-sm font-medium text-gray-900 '
                      >
                        Gender
                      </label>
                      <select
                        id='gender'
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5'
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                      >
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                        <option value='Other'>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className='w-7/12 flex flex-col justify-center items-center'>
                    <label
                      htmlFor='avatar'
                      className='block mb-2 text-sm font-medium text-gray-900'
                    >
                      Avatar
                    </label>
                    <div className='h-48 mb-4 w-full flex justify-center items-center'>
                      <img className='h-48 rounded-lg' src={formData.avatar} />
                    </div>
                    <input
                      className='block w-8/12 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50'
                      id='file_input'
                      type='file'
                    />
                  </div>
                </div>

                <div className='flex w-full gap-4'>
                  <BoxWrapper>
                    <>
                      <label
                        htmlFor='country'
                        className='block mb-2 text-sm font-medium text-gray-900 '
                      >
                        Your country
                      </label>
                      <input
                        type='text'
                        name='country'
                        id='country'
                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:border-blue-500'
                        placeholder='name@company.com'
                        required={true}
                        value={formData.address.country}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              country: e.target.value,
                            },
                          })
                        }
                      />
                    </>
                  </BoxWrapper>
                  <BoxWrapper>
                    <div>
                      <label
                        htmlFor='province'
                        className='block mb-2 text-sm font-medium text-gray-900 '
                      >
                        Your province
                      </label>
                      <input
                        type='text'
                        name='province'
                        id='province'
                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:border-blue-500'
                        placeholder='Nguyễn Văn A'
                        required={true}
                        value={formData.address.province}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              province: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </BoxWrapper>
                </div>

                <div className='flex w-full gap-4'>
                  <BoxWrapper>
                    <>
                      <label
                        htmlFor='district'
                        className='block mb-2 text-sm font-medium text-gray-900 '
                      >
                        Your district
                      </label>
                      <input
                        type='text'
                        name='district'
                        id='district'
                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:border-blue-500'
                        placeholder='name@company.com'
                        required={true}
                        value={formData.address.district}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              district: e.target.value,
                            },
                          })
                        }
                      />
                    </>
                  </BoxWrapper>
                  <BoxWrapper>
                    <div>
                      <label
                        htmlFor='ward'
                        className='block mb-2 text-sm font-medium text-gray-900 '
                      >
                        Your ward
                      </label>
                      <input
                        type='text'
                        name='ward'
                        id='ward'
                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:border-blue-500'
                        placeholder='Nguyễn Văn A'
                        required={true}
                        value={formData.address.ward}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              ward: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </BoxWrapper>
                </div>
                <div>
                  <label
                    htmlFor='detail_address'
                    className='block mb-2 text-sm font-medium text-gray-900 '
                  >
                    Your detail address
                  </label>
                  <input
                    type='text'
                    name='detail_address'
                    id='detail_address'
                    className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:border-blue-500'
                    placeholder='Nguyễn Văn A'
                    required={true}
                    value={formData.address.detailAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          detailAddress: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor='password'
                    className='block mb-2 text-sm font-medium text-gray-900 '
                  >
                    Password
                  </label>
                  <input
                    type='password'
                    name='password'
                    id='password'
                    placeholder='••••••••'
                    className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:border-blue-500'
                    required={true}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor='confirm_password'
                    className='block mb-2 text-sm font-medium text-gray-900 '
                  >
                    Confirm password
                  </label>
                  <input
                    type='confirm_password'
                    name='confirm_password'
                    id='confirm_password'
                    placeholder='••••••••'
                    className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:border-blue-500'
                    required={true}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='flex items-center justify-between'>
                  <div className='text-md font-medium text-primary-600 hover:underline dark:text-primary-500'>
                    Forgot password?
                  </div>
                  <Link to='/auth/login'>
                    <p className='text-md font-light text-black'>
                      Have an account yet?{' '}
                      <span className='font-medium text-primary-600 hover:underline dark:text-primary-700 underline'>
                        Login
                      </span>
                    </p>
                  </Link>
                </div>
                <button
                  type='submit'
                  onClick={submitHandler}
                  className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </>
      </AuthBox>
    </Layout>
  );
};
