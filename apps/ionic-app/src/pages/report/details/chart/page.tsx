import React from 'react';
import { getBackgroundColorByIntensity } from '../../../../utils/getColor';
import { Timestamp } from 'firebase/firestore';

interface PerformanceChartProps {
  data: { 
    intensidade: number;
    dataCadastro: string | Date | Timestamp; 
  }[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const parseDate = (dateInput: string | Date | Timestamp): Date => {
    if (dateInput instanceof Timestamp) {
      return dateInput.toDate();
    } else if (typeof dateInput === 'string') {
      return new Date(dateInput);
    }
    return dateInput;
  };

  console.log(data)

  if (!data || data.length === 0) {
    return (
      <div className="text-center p-5 text-white bg-stone-800 rounded-lg shadow-sm">
        Nenhum dado de desempenho disponível
      </div>
    );
  }

  return (
    <div className="my-5 p-4 bg-stone-800 rounded-lg shadow-sm">
      <h3 className="pb-20 text-white text-lg font-medium">
        Performance
      </h3>      
      <div className="flex justify-around items-end h-48 gap-2">
        {data.map((item, index) => {
          const intensidade = Math.min(Math.max(item.intensidade, 0), 10);
          const porcentagem = intensidade * 10;
          const barColor = getBackgroundColorByIntensity(intensidade);
          const date = parseDate(item.dataCadastro);

          return (
            <div key={`chart-${index}`} className="flex flex-col items-center flex-1 max-w-[60px]">
              <div className="h-44 w-10 flex items-end bg-gray-100 rounded-t-md overflow-hidden">
                <div 
                  className={`w-full ${barColor} transition-all duration-300 rounded-t-md`}
                  style={{ height: `${porcentagem}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-white text-center">
                {date.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(PerformanceChart);