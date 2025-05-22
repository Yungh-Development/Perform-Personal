import React from 'react';

interface CustomIntensidadeProps {
  value: number;
}

const CustomIntensidade: React.FC<CustomIntensidadeProps> = ({ value }) => {
  const getColor = (intensidade: number) => {
    if (intensidade <= 2) return 'text-red-500';
    if (intensidade <= 5) return 'text-orange-400';
    if (intensidade <= 8) return 'text-yellow-400';
    return 'text-green-500';
  };

  const customColor = getColor(value);
  const displayValue = Math.min(Math.max(value, 0), 10); 

  return (
    <span className={`text-sm font-bold ${customColor}`}>
      {displayValue}
    </span>
  );
};

export default CustomIntensidade;