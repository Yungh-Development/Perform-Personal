import { IonButton, IonHeader, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';

interface titleInterface {
    titlePage: string;
    urlTemplate: string;
}

const HeaderTemplate = ({titlePage, urlTemplate}: titleInterface) => {
  const router = useIonRouter();

  return (
    <IonHeader>
      <IonToolbar className="bg-blue-600">
        <div className="flex w-full ion-padding">
          <IonButton color="yellow-personal" shape="round" onClick={()=> router.push(urlTemplate)}>
            <ion-icon name="arrow-back" slot="icon-only" color="black"></ion-icon>                         
          </IonButton>
          <div className="flex justify-center items-center">
              <IonTitle className="text-white text-2xl ml-10">{titlePage}</IonTitle>
          </div>
        </div>
      </IonToolbar>
    </IonHeader>      
  );
};

export default HeaderTemplate;