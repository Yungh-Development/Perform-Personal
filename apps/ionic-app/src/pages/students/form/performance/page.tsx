import {
  IonContent,
  IonPage,
  IonFooter,
  IonButton,
  IonToast,
} from "@ionic/react";
import React, { useState } from "react";
import HeaderTemplate from "../../../template/header/page";

import { useStudentForm } from "../../../../hooks/useStudentForm";
import { useStudentManager } from "../../../../hooks/useStudentManager";
import { useFirebaseSync } from "../../../../hooks/useFirebaseSync";

import StudentAutocomplete from "../../../../components/studentAutocomplete";
import PerformanceSelector from "../../../../components/performanceSelector";
import StudentFormFields from "../../../../components/studentFormFields";

const PerformanceForm: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMensagem, setToastMensagem] = useState("");

  const {
    formData,
    isSaving,
    setSelectedStudent,
    setIntensidade,
    setObservacao,
    setJustificativa,
    handleIconClick,
    handleSubmit,
  } = useStudentForm();

  const { loadStudents } = useStudentManager();
  
  const { isSyncing, handleManualSync } = useFirebaseSync();

  const showToastMessage = (message: string) => {
    setToastMensagem(message);
    setShowToast(true);
  };

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, showToastMessage, showToastMessage);
  };

  const onSyncClick = () => {
    handleManualSync(showToastMessage);
  };

  return (
    <IonPage>
      <HeaderTemplate 
        titlePage="Novo Relatório" 
        urlTemplate="/home" 
        showSyncButton={true}
        onSyncClick={onSyncClick}
        isSyncing={isSyncing}
      />
      <IonContent className="h-screen">
        <div className="ion-padding">
          <h2 className="text-xl font-bold mb-6 text-white">
            Novo Relatório de Aluno
          </h2>          
          <form onSubmit={onSubmit} className="h-full w-full">
            <div className="py-3 w-full">              
              <StudentAutocomplete
                selectedStudent={formData.selectedStudent}
                onStudentChange={setSelectedStudent}
                students={loadStudents()}
              />
              <StudentFormFields
                intensidade={formData.intensidade}
                observacao={formData.observacao}
                justificativa={formData.justificativa}
                onIntensidadeChange={setIntensidade}
                onObservacaoChange={setObservacao}
                onJustificativaChange={setJustificativa}
              />
              <PerformanceSelector
                selectedIcon={formData.selectedIcon}
                onIconClick={handleIconClick}
              />           
            </div>
          </form>
        </div>
      </IonContent>      
      <IonFooter className="ion-no-border">
        <div className="ion-padding">
          <IonButton
            expand="block"
            type="submit"
            onClick={onSubmit}
            disabled={isSaving}
            fill="clear"
            className="text-black font-semibold py-1 bg-amber-500 rounded-full w-full hover:opacity-90"
          >
            {isSaving ? "Salvando..." : "Salvar Relatório"}
          </IonButton>
        </div>
      </IonFooter>
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMensagem}
        duration={3000}
        position="top"
      />
    </IonPage>
  );
};

export default PerformanceForm;

