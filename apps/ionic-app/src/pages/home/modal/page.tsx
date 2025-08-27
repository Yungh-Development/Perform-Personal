import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonButton
} from "@ionic/react";
import React from "react";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-padding">Guia</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="flex flex-col h-full justify-center">        
          <div className="bg-[#131313] ion-padding">    
            <IonLabel className="flex items-center h-10 text-white">  
              <HomeOutlinedIcon className="mr-4"/>
              <h3>Botão para a HomePage</h3>
            </IonLabel>
            <IonLabel className="flex items-center h-10 text-white">  
              <FitnessCenterOutlinedIcon className="mr-4"/>
              <h3>Botão para Relatório de Treinos</h3>
            </IonLabel>
            <IonLabel className="flex items-center h-10 text-white">  
              <AddOutlinedIcon className="mr-4"/>
              <h3 className='ml-4'>Botão para Adicionar Aluno e Treino</h3>
            </IonLabel>                   
            <IonLabel className="flex items-center h-10 text-white">  
              <ListAltOutlinedIcon className="mr-4"/>
              <h3>Botão para Lista de Alunos Cadastrados</h3>
            </IonLabel>
            <div className="flex justify-center items-center">
              <IonButton
                expand="block"
                onClick={onClose}
                fill="clear"
                className="font-bold text-black text-[11px] bg-amber-500 mt-10 rounded w-1/3 h-10 flex justify-center items-center"
              >
                Voltar para Home
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default GuideModal;