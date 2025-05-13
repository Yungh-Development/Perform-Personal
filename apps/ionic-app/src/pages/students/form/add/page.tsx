import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton, useIonRouter, IonToast } from '@ionic/react';
import React, { useState } from 'react';

interface StudentData {
  id: string;
  nome: string;
  sobrenome: string;
}

const StudentAddForm: React.FC = () => {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [showToast, setShowToast] = useState(false);
  const router = useIonRouter();

  const saveStudent = () => {
    const student: StudentData = {
      id: Date.now().toString(),
      nome,
      sobrenome
    };

    const existingStudents = localStorage.getItem('studentsForm');
    let studentsArray: StudentData[] = [];
    
    if (existingStudents) {
      studentsArray = JSON.parse(existingStudents);
    }
    
    studentsArray.push(student);
    localStorage.setItem('studentsForm', JSON.stringify(studentsArray));
    
    setShowToast(true);
    setNome('');
    setSobrenome('');
    
    setTimeout(() => {
      router.push('/home');
    }, 1500);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="bg-blue-600">
          <div className="flex w-full ion-padding">
            <IonButton color="yellow-personal" shape="round" onClick={() => router.push("/home")}>
              <ion-icon name="arrow-back" slot="icon-only" color="black"></ion-icon>
            </IonButton>
            <div className="flex justify-center items-center">
              <IonTitle className="text-white ml-10">Novo Aluno</IonTitle>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-6 text-white">Cadastrar Aluno</h2>
          
          <div className="space-y-4">
            <IonItem className="mb-4" color="page-container">
              <IonInput
                type="text"
                placeholder="Nome"
                value={nome}
                onIonChange={(e) => setNome(e.detail.value!)}
                required
              />
            </IonItem>
            
            <IonItem className="mb-4" color="page-container">
              <IonInput
                type="text"
                placeholder="Sobrenome"
                value={sobrenome}
                onIonChange={(e) => setSobrenome(e.detail.value!)}
                required
              />
            </IonItem>
            
            <IonButton 
              expand="block"
              fill="clear"
              className="bg-amber-500 text-black font-semibold rounded-full mt-6"
              onClick={saveStudent}
              disabled={!nome || !sobrenome}
            >
              Cadastrar
            </IonButton>
          </div>
        </div>
      </IonContent>
      
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="Aluno cadastrado com sucesso!"
        duration={1500}
        position="top"
      />
    </IonPage>
  );
};

export default StudentAddForm;