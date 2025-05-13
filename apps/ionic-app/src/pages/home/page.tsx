import React from 'react';
import { IonButton, IonContent, IonFooter, IonHeader, IonIcon, IonItem, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';


const HomePage = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="flex w-full ion-padding">
            <IonButton color="yellow-personal" shape="round">
              <a href='/' className="flex justify-center items-center">
                <ion-icon name="arrow-back" slot="icon-only" color="black"></ion-icon>      
              </a>   
            </IonButton>
            <div className="flex justify-center items-center">
              <IonTitle className="text-white ml-10">Homepage</IonTitle>
            </div>
          </div>         
        </IonToolbar>
      </IonHeader>

      <IonContent color="page-background" className="ion-padding">
 
      </IonContent>

      <IonFooter className="relative">
        <div className="absolute bg-amber-500 rounded-full w-14 h-14 flex items-center justify-center left-1/2 -ml-7 -top-1/2">
          <div className="flex">
          <a href="/formulario-performance" className="mt-2">
            <ion-icon name="add" color="black" size="large"></ion-icon>
          </a>
          </div>
        </div>
        <div className="flex items-center py-4">
          <div className="flex justify-around w-full">
          <IonButton fill="clear">
            <a href="/home">
              <ion-icon name="grid" size="large"></ion-icon>
            </a>
          </IonButton>       
          <IonButton fill="clear">
            <a href="/relatorio">
              <ion-icon name="pie" size="large"></ion-icon>
            </a>
          </IonButton>
          </div>
          <div className="w-full flex justify-center">      
          <IonButton fill="clear">
            <a href="/lista-alunos">
              <ion-icon name="people" size="large"></ion-icon>
            </a>
          </IonButton>  
          </div>  
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default HomePage;