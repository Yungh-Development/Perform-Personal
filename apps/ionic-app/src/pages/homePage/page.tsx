import React from 'react';
import { IonContent, IonPage, IonButton, IonHeader, IonCardHeader, IonCard, IonCardContent } from '@ionic/react';

const HomePage: React.FC = () => {
  return (
    <IonPage>
      <IonCard> 
        <IonCardContent>
          <div className="w-full flex flex-col">
            <div className="">
              <img
                src="./public/image-fit-home.jpg" 
                alt="Perform"
                className=""
              />
            </div>
            <div className="h-full absolute top-0 flex flex-col justify-center bg-black items-center text-white">
              <h1 className="">Perform</h1>
              <p className="mt-2 text-lg">Gerencie a performance dos seus alunos e atletas</p>
              <div>
                <button type="button" className="h-8 w-8 rounded-full bg-orange-500 hover:bg-orange-400 text-white">
                  <span className="">
                    <span className="mr-2">→</span>
                  </span>
                </button>
              </div>
            </div>   
          </div>    
        </IonCardContent>
      </IonCard>
    </IonPage>
  );
};

export default HomePage;