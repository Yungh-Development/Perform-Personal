import { IonContent, IonHeader, IonPage,IonFooter, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton, useIonRouter , IonRange } from '@ionic/react';
import React, { useState } from 'react';

const StudentForm: React.FC = () => {
  const [nome, setNome] = useState('');
  const [intensidade, setIntensidade] = useState('');
  const [observacao, setObservacao] = useState('');
  const [performance, setPerformance] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const router = useIonRouter();

  const handleIconClick = (iconName: string) => {
    setPerformance(iconName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nome, intensidade, observacao, performance, justificativa });
    setNome('');
    setIntensidade('');
    setPerformance('');
    setSelectedIcon(null);
    setJustificativa('');

    router.push('/HomePage', 'back', 'push');
  };

  console.log(intensidade)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="bg-blue-600">
            <div className="flex w-full ion-padding">
                <IonButton color="yellow-personal" shape="round">
                    <a href='/HomePage' className="flex justify-center items-center">
                        <ion-icon name="arrow-back" slot="icon-only" color="black"></ion-icon>      
                    </a>   
                </IonButton>
                <div className="flex justify-center items-center">
                    <IonTitle className="text-white ml-10">Novo Relatório</IonTitle>
                </div>
            </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="h-screen" >
        <div className="ion-padding ">
          <h2 className="text-xl font-bold mb-6 text-white">Novo aluno</h2>          
          <form onSubmit={handleSubmit} className="h-full w-full">
            <div className="py-3 w-full">
              <IonItem className="mb-4 mt-1" color="page-container">
                <IonInput
                  type="text"
                  placeholder="Nome do Aluno"
                  onIonChange={(e) => setNome(e.detail.value!)}
                  required
                />
              </IonItem>
              <IonLabel className="mt-4 w-full">Intensidade do Treino</IonLabel>
              <IonItem className="mb-4 mt-1 p-0 w-full" color="page-container">
                <IonRange 
                  aria-label="Range with ticks" 
                  className="w-full mx-3"
                  ticks={true} 
                  snaps={true} 
                  onIonChange={(e:any) => setIntensidade(e.detail.value!)}
                  min={0} 
                  max={10}
                  />
              </IonItem>
              <IonItem className="mb-4 mt-1" color="page-container">
                <IonInput
                  type="text"
                  placeholder="Maior facilidade ou dificuldade"
                  onIonChange={(e) => setObservacao(e.detail.value!)}
                  className=""
                  required
                />
              </IonItem>
              <IonLabel>Performance do Aluno</IonLabel>
              <div className="my-4 flex justify-between">
                <div 
                  className={`rounded-full p-6 bg-red-500 ${selectedIcon === 'negativa' ? 'ring-4 ring-blue-500' : ''}`}
                  onClick={() => handleIconClick('negativa')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" className="bi bi-emoji-frown-fill" viewBox="0 0 16 16">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m-2.715 5.933a.5.5 0 0 1-.183-.683A4.5 4.5 0 0 1 8 9.5a4.5 4.5 0 0 1 3.898 2.25.5.5 0 0 1-.866.5A3.5 3.5 0 0 0 8 10.5a3.5 3.5 0 0 0-3.032 1.75.5.5 0 0 1-.683.183M10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8"/>
                  </svg>
                </div>
                <div 
                  className={`rounded-full p-6 bg-amber-500 ${selectedIcon === 'ok' ? 'ring-4 ring-blue-500' : ''}`}
                  onClick={() => handleIconClick('ok')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" className="bi bi-emoji-neutral-fill" viewBox="0 0 16 16">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m-3 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8"/>
                  </svg>
                </div>
                <div 
                  className={`rounded-full p-6 bg-yellow-500 ${selectedIcon === 'boa' ? 'ring-4 ring-blue-500' : ''}`}
                  onClick={() => handleIconClick('boa')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" className="bi bi-emoji-smile-fill" viewBox="0 0 16 16">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8"/>
                  </svg>
                </div>
                <div 
                  className={`rounded-full p-6 bg-green-500 ${selectedIcon === 'excelente' ? 'ring-4 ring-blue-500' : ''}`}
                  onClick={() => handleIconClick('excelente')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" className="bi bi-emoji-heart-eyes-fill" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M4.756 4.566c.763-1.424 4.02-.12.952 3.434-4.496-1.596-2.35-4.298-.952-3.434m6.559 5.448a.5.5 0 0 1 .548.736A4.5 4.5 0 0 1 7.965 13a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .548-.736h.005l.017.005.067.015.252.055c.215.046.515.108.857.169.693.124 1.522.242 2.152.242s1.46-.118 2.152-.242a27 27 0 0 0 1.109-.224l.067-.015.017-.004.005-.002zm-.07-5.448c1.397-.864 3.543 1.838-.953 3.434-3.067-3.554.19-4.858.952-3.434z"/>
                  </svg>
                </div>                
              </div>
              <IonItem className="mb-4 mt-1" color="page-container">
                <IonInput
                  type="text"
                  placeholder="Justificativa"
                  onIonChange={(e) => setJustificativa(e.detail.value!)}
                  className=""
                  required
                />
              </IonItem> 
            </div> 
            <IonFooter>
              <div className="mt-10">
                <IonButton 
                  type="submit"         
                  fill="clear"
                  className="text-black font-semibold py-1 bg-amber-500 rounded-full w-full hover:opacity-90"
                  expand="block"
                >
                  Salvar
                </IonButton>
              </div>
            </IonFooter>    
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default StudentForm;