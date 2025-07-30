import {
  IonContent,
  IonPage,
  IonFooter,
  IonButton,
  IonToast,
  useIonRouter,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonItem,
  IonLabel,
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const router = useIonRouter();

  const {
    formData,
    isSaving,
    setSelectedStudent,
    setIntensidade,
    setObservacao,
    setJustificativa,
    handleIconClick,
    handleSubmit,
    resetForm,
  } = useStudentForm();

  const { loadStudents } = useStudentManager();
  
  const { isSyncing, handleManualSync } = useFirebaseSync();

  const showToastMessage = (message: string) => {
    setToastMensagem(message);
    setShowToast(true);
  };

const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await handleSubmit(e, showToastMessage, showToastMessage);
    setFormSubmitted(true);
    setShowSuccessModal(true);
  } catch (error) {
    console.error("Erro ao salvar relatório:", error);
  }
};

  const handleAddMore = () => {
    resetForm();
    setShowSuccessModal(false);
    setTimeout(() => {
      const firstInput = document.querySelector('ion-autocomplete');
      if (firstInput) (firstInput as HTMLElement).focus();
    }, 100);
  };

  const handleSaveAndGoToReport = () => {
    setShowSuccessModal(false);
    router.push("/relatorio");
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
          <form onSubmit={handleFormSubmit} className="h-full w-full">
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
            onClick={handleFormSubmit}
            disabled={isSaving}
            fill="clear"
            className="text-black font-semibold py-1 bg-amber-500 rounded-full w-full hover:opacity-90"
          >
            {isSaving ? "Salvando..." : "Salvar Relatório"}
          </IonButton>
        </div>
      </IonFooter>

      <IonModal isOpen={showSuccessModal} onDidDismiss={() => setShowSuccessModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Relatório Salvo</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="flex flex-col h-full justify-center">
            <IonItem lines="none" className="text-center">
              <IonLabel className="text-lg">O que deseja fazer agora?</IonLabel>
            </IonItem>
            
            <div className="mt-8 space-y-4">
              <IonButton
                expand="block"
                onClick={handleAddMore}
                fill="solid"
                className="font-semibold"
              >
                Adicionar Mais
              </IonButton>
              
              <IonButton
                expand="block"
                onClick={handleSaveAndGoToReport}
                fill="outline"
                className="font-semibold"
              >
                Salvar e Ir para Relatórios
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

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