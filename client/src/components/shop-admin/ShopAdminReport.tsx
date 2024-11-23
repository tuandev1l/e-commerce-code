import { IReport } from './ShopAdminStatistic';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';

type Props = {
  dataReport: IReport;
};

Chart.register(...registerables);

export const ShopAdminReport = ({ dataReport }: Props) => {
  let delayed: boolean;

  return (
    <Bar
      data={{
        labels: Object.keys(dataReport),
        datasets: [
          {
            label: 'Đơn hàng',
            data: Object.values(dataReport),
            backgroundColor: '#54b7ff',
            barThickness: 'flex',
            maxBarThickness: 54,
            barPercentage: 1.0,
          },
        ],
      }}
      options={{
        maintainAspectRatio: false,
        //   animation: {
        //     onComplete: () => {
        //       delayed = true;
        //     },
        //     delay: (context) => {
        //       let delay = 0;
        //       if (
        //         context.type === 'data' &&
        //         context.mode === 'default' &&
        //         !delayed
        //       ) {
        //         delay = context.dataIndex * 300 + context.datasetIndex * 100;
        //       }
        //       return delay;
        //     },
        //   },
      }}
      height={360}
    />
  );
};
