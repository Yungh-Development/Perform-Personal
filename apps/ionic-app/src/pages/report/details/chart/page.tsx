import React from 'react';

interface PerformanceChartProps {
  data: { 
    intensidade: number;
    dataCadastro: string; 
  }[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center p-5 text-white bg-gray-50 rounded-lg">
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
          
          let barColor = '';
          if (intensidade <= 2) barColor = 'bg-red-500';
          else if (intensidade <= 5) barColor = 'bg-orange-400';
          else if (intensidade <= 8) barColor = 'bg-yellow-400';
          else barColor = 'bg-green-500';

          return (
            <div key={`chart-${index}`} className="flex flex-col items-center flex-1 max-w-[60px]">
              <div className="h-44 w-10 flex items-end bg-gray-100 rounded-t-md overflow-hidden">
                <div 
                  className={`w-full ${barColor} transition-all duration-300 rounded-t-md`}
                  style={{ height: `${porcentagem}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-white text-center">
                {new Date(item.dataCadastro).toLocaleDateString('pt-BR', {
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