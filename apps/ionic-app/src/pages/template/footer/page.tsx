import { IonButton, IonFooter } from '@ionic/react';


const FooterTemplate = () => {
  return (
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
  );
};

export default FooterTemplate;