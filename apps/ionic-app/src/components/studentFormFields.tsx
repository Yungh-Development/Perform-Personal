import React from 'react';
import { IonInput, IonItem, IonLabel, IonRange } from '@ionic/react';

interface StudentFormFieldsProps {
  intensidade: number;
  observacao: string;
  justificativa: string;
  onIntensidadeChange: (value: number) => void;
  onObservacaoChange: (value: string) => void;
  onJustificativaChange: (value: string) => void;
}

const StudentFormFields: React.FC<StudentFormFieldsProps> = ({
  intensidade,
  observacao,
  justificativa,
  onIntensidadeChange,
  onObservacaoChange,
  onJustificativaChange,
}) => {
  return (
    <>
      <IonLabel className="mt-4 w-full">Intensidade do Treino</IonLabel>
      <IonItem className="mb-4 mt-1 p-0 w-full" color="page-container">
        <IonRange
          aria-label="Range with ticks"
          className="w-full mx-3"
          ticks={true}
          snaps={true}
          value={intensidade}
          onIonChange={(e: any) => onIntensidadeChange(e.detail.value!)}
          min={0}
          max={10}
        />
      </IonItem>      
      <IonItem className="mb-4 mt-1" color="page-container">
        <IonInput
          type="text"
          placeholder="Maior facilidade ou dificuldade"
          value={observacao}
          onIonChange={(e) => onObservacaoChange(e.detail.value!)}
        />
      </IonItem>      
      <IonItem className="mb-4 mt-1" color="page-container">
        <IonInput
          type="text"
          placeholder="Justificativa (opcional)"
          value={justificativa}
          onIonChange={(e) => onJustificativaChange(e.detail.value!)}
        />
      </IonItem>
    </>
  );
};

export default StudentFormFields;

