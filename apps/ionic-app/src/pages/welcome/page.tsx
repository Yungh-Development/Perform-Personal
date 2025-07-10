import React from 'react';
import { IonPage, IonCard, IonCardContent } from '@ionic/react';

const WelcomePage: React.FC = () => {
  return (
    <IonPage>
      <IonCard> 
        <IonCardContent className="h-screen ion-no-padding">
          <div className="h-screen">
            <div className="relative w-full xl:h-[70%] lg:h-[60%]">
              <span className="text-amber-500 text-[8px] absolute bottom-0 right-0">Gabi Moraes<br/> Personal</span>
              <img
                src="./public/personal-welcome-image.jpeg" 
                alt="Perform"
                className="h-full w-full object-fill"
              />
            </div>
            <div className="h-screen relative">
              <div className="h-96 w-full flex absolute top-0 flex-col justify-center bg-black items-center text-white">
                <div className="w-96 flex flex-col justify-center items-center text-center">
                  <span className="text-amber-500 text-5xl">Perform</span>
                  <span className="text-lg my-4 w-64">Gerencie a performance e evolução dos seus alunos e atletas</span>
                  <div className="bg-amber-500 rounded-full">
                    <a href='/home' className="w-8 h-8 bg-amber-500 flex justify-center items-center">                
                      <span className="text-[18px] font-black text-black">→</span>            
                    </a>   
                  </div>
                </div>          
              </div>
            </div>   
          </div>    
        </IonCardContent>
      </IonCard>
    </IonPage>
  );
};

export default WelcomePage;