import React from 'react';
import { IonLabel } from '@ionic/react';

interface PerformanceSelectorProps {
  selectedIcon: string | null;
  onIconClick: (iconName: string) => void;
}

const PerformanceSelector: React.FC<PerformanceSelectorProps> = ({
  selectedIcon,
  onIconClick,
}) => {
  const performanceOptions = [
    {
      id: 'negativa',
      color: 'bg-red-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" className="bi bi-emoji-frown-fill" viewBox="0 0 16 16">
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m-2.715 5.933a.5.5 0 0 1-.183-.683A4.5 4.5 0 0 1 8 9.5a4.5 4.5 0 0 1 3.898 2.25.5.5 0 0 1-.866.5A3.5 3.5 0 0 0 8 10.5a3.5 3.5 0 0 0-3.032 1.75.5.5 0 0 1-.683.183M10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8"/>
        </svg>
      ),
    },
    {
      id: 'ok',
      color: 'bg-amber-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" className="bi bi-emoji-neutral-fill" viewBox="0 0 16 16">
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m-3 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8"/>
        </svg>
      ),
    },
    {
      id: 'boa',
      color: 'bg-yellow-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" className="bi bi-emoji-smile-fill" viewBox="0 0 16 16">
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8"/>
        </svg>
      ),
    },
    {
      id: 'excelente',
      color: 'bg-green-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" className="bi bi-emoji-heart-eyes-fill" viewBox="0 0 16 16">
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M4.756 4.566c.763-1.424 4.02-.12.952 3.434-4.496-1.596-2.35-4.298-.952-3.434m6.559 5.448a.5.5 0 0 1 .548.736A4.5 4.5 0 0 1 7.965 13a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .548-.736h.005l.017.005.067.015.252.055c.215.046.515.108.857.169.693.124 1.522.242 2.152.242s1.46-.118 2.152-.242a27 27 0 0 0 1.109-.224l.067-.015.017-.004.005-.002zm-.07-5.448c1.397-.864 3.543 1.838-.953 3.434-3.067-3.554.19-4.858.952-3.434z"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <IonLabel>Performance do Aluno</IonLabel>
      <div className="my-4 flex justify-between">
        {performanceOptions.map((option) => (
          <div
            key={option.id}
            className={`rounded-full p-6 ${option.color} cursor-pointer transition-all duration-200 ${
              selectedIcon === option.id ? 'ring-4 ring-blue-500' : ''
            }`}
            onClick={() => onIconClick(option.id)}
          >
            {option.icon}
          </div>
        ))}
      </div>
    </>
  );
};

export default PerformanceSelector;

