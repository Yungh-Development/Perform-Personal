import {
  IonButton,
  IonHeader,
  IonTitle,
  IonToolbar,
  useIonRouter,
  IonButtons, 
  IonIcon, 
  IonSpinner 
} from "@ionic/react";
import { cloudUploadOutline } from "ionicons/icons"; 

interface HeaderTemplateProps {
  titlePage: string;
  urlTemplate: string;
  showSyncButton?: boolean;
  onSyncClick?: () => void; 
  isSyncing?: boolean;    
}

const HeaderTemplate: React.FC<HeaderTemplateProps> = ({
  titlePage,
  urlTemplate,
  showSyncButton = false, 
  onSyncClick,
  isSyncing = false,    
}) => {
  const router = useIonRouter();

  return (
    <IonHeader>
      <IonToolbar className="bg-blue-600">
        <div className="flex ion-padding">
          <IonButton
            color="yellow-personal"
            shape="round"
            onClick={() => router.push(urlTemplate, "back", "pop")} 
          >
            <IonIcon slot="icon-only" icon="arrow-back" color="black"></IonIcon>
          </IonButton>    
          <div className="flex ml-4 justify-center items-center">
            <IonTitle className="text-white text-2xl">{titlePage}</IonTitle>
          </div>
        </div>
        {showSyncButton && (
          <IonButtons slot="end">
            <IonButton
              onClick={onSyncClick} 
              disabled={isSyncing}  
              fill="clear"        
              color="light"
              shape="round"
            >
              {isSyncing ? (
                <IonSpinner name="dots" />
              ) : (
                <IonIcon slot="icon-only" icon={cloudUploadOutline} />
              )}
            </IonButton>
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default HeaderTemplate;

