import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, 
  IonItem, IonLabel, IonButton, IonIcon, IonBadge, IonFooter, 
  IonAlert, IonToast
} from '@ionic/react';
import { trash, barChart } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

interface StudentData {
  id: string;
  nome: string;
  sobrenome: string;
  intensidade: string;
  observacao: string;
  performance: string;
  justificativa: string;
  dataCadastro: string;
}

const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [studentToDelete, setStudentToDelete] = useState<StudentData | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const history = useHistory();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const savedData = localStorage.getItem('studentsData');
    if (savedData) {
      setStudents(JSON.parse(savedData));
    }
  };

  const confirmDelete = (student: StudentData) => {
    setStudentToDelete(student);
    setShowAlert(true);
  };

  const deleteStudent = () => {
    if (!studentToDelete) return;
    
    try {
      const updatedStudents = students.filter(s => s.id !== studentToDelete.id);
      localStorage.setItem('studentsData', JSON.stringify(updatedStudents));
      setStudents(updatedStudents);
      setToastMessage('Aluno removido com sucesso!');
      setShowToast(true);
    } catch (error) {
      console.error('Erro ao remover aluno:', error);
      setToastMessage('Erro ao remover aluno');
      setShowToast(true);
    } finally {
      setStudentToDelete(null);
      setShowAlert(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="bg-blue-600">
          <div className="flex w-full ion-padding">
            <IonButton color="yellow-personal" shape="round" onClick={() => history.push("/home")}>
              <IonIcon name="arrow-back" slot="icon-only" color="black" />
            </IonButton>
            <div className="flex justify-center items-center">
              <IonTitle className="text-white ml-10">Alunos Cadastrados</IonTitle>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>      
      <IonContent className="ion-padding-bottom">
        <div className="pb-20">
          <IonList>
            {students.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                Nenhum aluno cadastrado ainda
              </div>
            ) : (
              students.map((student) => (
                <IonItem key={student.id} className="ion-padding">
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <IonLabel>
                        <h1 className="font-bold">{student.nome} {student.sobrenome}</h1>                     
                      </IonLabel>                    
                      <div className="flex items-center space-x-6">                                   
                        <IonButton 
                          fill="clear"
                          onClick={() => history.push("/relatorio")}
                          color="secondary"
                        >
                          <IonIcon icon={barChart} slot="icon-only">
                            <a href="relatorio"></a>
                          </IonIcon>
                        </IonButton>                      
                        <IonButton 
                          fill="clear"
                          onClick={() => confirmDelete(student)}
                          color="danger"
                        >
                          <IonIcon icon={trash} slot="icon-only" />
                        </IonButton>
                      </div>
                    </div>
                  </div>
                </IonItem>
              ))
            )}
          </IonList>
        </div>
        <div className="fixed bottom-38 left-0 right-0 px-4 z-10">
          <div className="max-w-md mx-auto">            
            <IonButton onClick={() => history.push("/formulario-aluno")} fill="clear" className="flex justify-center items-center text-black font-semibold py-1 w-full rounded-full w-96 h-10 bg-amber-500">
              Novo aluno
            </IonButton>    
          </div>
        </div>
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
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'Confirmar Exclusão'}
        message={`Deseja realmente excluir o aluno ${studentToDelete?.nome}?`}
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: 'Excluir',
            handler: deleteStudent
          }
        ]}
      />
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="top"
      />
    </IonPage>
  );
};

export default StudentsList;