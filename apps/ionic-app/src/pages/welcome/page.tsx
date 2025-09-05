import React from 'react';
import { IonPage, IonCard, IonCardContent, IonImg } from '@ionic/react';

const WelcomePage: React.FC = () => {
  return (
    <>
      <IonCard> 
        <IonCardContent className="h-screen ion-no-padding">
          <div className="relative h-full">
            <div className="relative w-full h-1/2">
              <span className="text-amber-500 text-[8px] absolute bottom-0 right-0">Gabi Moraes<br/> Personal</span>
              <IonImg
                src="/assets/personal-welcome-image.png" 
                alt="Perform"
                className="h-full w-full object-fill"
              ></IonImg>
            </div>
            <div className="h-1/2 relative">
              <div className="h-full w-full flex flex-col justify-center bg-black items-center text-white">
                <div className="w-96 flex flex-col justify-center items-center text-center">
                  <span className="text-amber-500 text-5xl">Perform</span>
                  <span className="text-lg my-4 w-64">Gerencie a performance e evolução dos seus alunos e atletas</span>
                  <div className="bg-amber-500 rounded-md w-1/4 h-10 flex justify-center items-center">
                    <a href='/home' className="h-10 bg-amber-500 flex justify-center items-center">                
                      <span className="font-black text-black">Iniciar</span>            
                    </a>   
                  </div>
                </div>          
              </div>
            </div>   
          </div>    
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default WelcomePage;