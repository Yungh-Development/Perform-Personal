import React, { useMemo } from 'react';

interface PerformanceChartProps {
  data: {
    intensidade: number;
  }[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const lastFiveRecords = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.slice(-5);
  }, [data]);

  if (lastFiveRecords.length === 0) {
    return (
      <div className="text-center p-5 text-gray-500 bg-gray-50 rounded-lg">
        Nenhum dado de desempenho disponível
      </div>
    );
  }

  return (
    <div className="my-5 p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-center mb-5 text-gray-700 text-lg font-medium">
        Desempenho Recente (Últimos 5 registros)
      </h3>
      
      <div className="flex justify-around items-end h-48 gap-2">
        {lastFiveRecords.map((item, index) => {
          const intensidade = Math.min(Math.max(item.intensidade, 0), 10);
          const heightPercentage = intensidade * 10;
          
          let barColor = '';
          if (intensidade <= 2) barColor = 'bg-red-500';
          else if (intensidade <= 5) barColor = 'bg-orange-400';
          else if (intensidade <= 8) barColor = 'bg-yellow-400';
          else barColor = 'bg-green-500';

          return (
            <div key={`intensidade-${index}`} className="flex flex-col items-center flex-1 max-w-[60px]">
              <div className="h-44 w-10 flex items-end bg-gray-100 rounded-t-md overflow-hidden">
                <div 
                  className={`w-full ${barColor} transition-all duration-300 rounded-t-md`}
                  style={{ height: `${heightPercentage}%` }}
                />
              </div>
              <div className="mt-1 text-sm font-bold text-gray-700">
                {intensidade}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(PerformanceChart);