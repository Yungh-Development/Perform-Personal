export const getBackgroundColorByIntensity = (intensity: number): string => {
  if (intensity >= 8) return 'bg-green-500'; 
  if (intensity >= 5) return 'bg-yellow-400';  
  if (intensity >= 2) return 'bg-orange-400';   
  return 'bg-red-500';  
};

export const getForegroundColorByIntensity = (intensity: number): string => {
  if (intensity >= 8) return 'text-green-500'; 
  if (intensity >= 5) return 'text-yellow-400';  
  if (intensity >= 2) return 'text-orange-400';   
  return 'text-red-500';  
}; 