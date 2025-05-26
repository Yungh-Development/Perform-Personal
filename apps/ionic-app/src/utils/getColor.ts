export const getBackgroundColorByIntensity = (intensidade: number): string => {
  const intensidadePadrao = Math.min(Math.max(intensidade, 0), 10);
  
  if (intensidadePadrao <= 2) return 'bg-red-500';
  if (intensidadePadrao <= 5) return 'bg-orange-400';
  if (intensidadePadrao <= 8) return 'bg-yellow-400';
  return 'bg-green-500';
};


export const getForegroundColorByIntensity = (intensidade: number): string => {
  const intensidadePadrao = Math.min(Math.max(intensidade, 0), 10);
  
  if (intensidadePadrao <= 2) return 'text-red-500';
  if (intensidadePadrao <= 5) return 'text-orange-400';
  if (intensidadePadrao <= 8) return 'text-yellow-400';
  return 'text-green-500';
};