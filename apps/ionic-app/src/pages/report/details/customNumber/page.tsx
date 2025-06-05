import React from 'react';
import { getForegroundColorByIntensity } from '../../../../utils/getColor';

interface CustomIntensidadeProps {
  value: number;
}

const CustomIntensidade: React.FC<CustomIntensidadeProps> = ({ value }) => {
  const customColor = getForegroundColorByIntensity(value);
  const displayValue = Math.min(Math.max(value, 0), 10); 

  return (
    <span className={`text-sm font-bold ${customColor}`}>
      {displayValue}
    </span>
  );
};

export default CustomIntensidade;
