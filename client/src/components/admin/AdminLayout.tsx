import {
  AdjustmentsHorizontalIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Layout } from '../../common/layout/Layout';
import { usernameSelector } from '../../store/selector';

type Props = {
  children: ReactElement;
};

export const AdminLayout = ({ children }: Props) => {
  const username = useSelector(usernameSelector);
  const location = useLocation();

  const tabs = [
    {
      title: 'Duyệt đơn đăng kí shop',
      link: `/admin`,
      Icon: <StarIcon width={24} />,
    },
    {
      title: 'Thay đổi trạng thái đơn hàng',
      link: `/admin/change-order-status`,
      Icon: <AdjustmentsHorizontalIcon width={24} />,
    },
    // {
    //   title: 'Sản phẩm tố cáo',
    //   link: `/admin/product-report`,
    //   Icon: <FlagIcon width={24} />,
    // },
  ];

  const activeTabIdx = tabs.findIndex((tab) => tab.link === location.pathname);
  const activeTab = activeTabIdx === -1 ? 0 : activeTabIdx;

  return (
    <Layout>
      <div className='w-11/12'>
        <div className='bg-gray-100 flex'>
          <aside className='w-64 bg-white p-4 h-fit sticky top-4 pb-8 rounded-lg mb-4 mr-8'>
            <div className='flex gap-2'>
              <img
                src='https://salt.tikicdn.com/desktop/img/avatar.png'
                className='h-12 rounded-full'
              />
              <div>
                <h2 className='text-gray-500 font-semibold'>Tài khoản của</h2>
                <p className='text-gray-700 font-bold'>{username}</p>
              </div>
            </div>
            <nav className='mt-6 space-y-4 text-gray-600'>
              {tabs.map((tab, idx) => (
                <Link to={tab.link} key={tab.title}>
                  <div
                    className={`flex items-center space-x-2 py-2 ${
                      idx === activeTab
                        ? 'text-blue-500 font-semibold'
                        : 'hover:text-blue-500'
                    }`}
                  >
                    {tab.Icon}
                    <span>{tab.title}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </aside>
          <div className='flex-1'>{children}</div>
        </div>
      </div>
    </Layout>
  );
};
