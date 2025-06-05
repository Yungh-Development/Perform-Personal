import { IonContent, IonPage, IonList, IonItem, IonLabel, IonButton, IonIcon, IonAlert, IonToast, IonSpinner } from '@ionic/react';
import { trash, barChart } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import HeaderTemplate from '../../template/header/page';
import FooterTemplate from '../../template/footer/page';
import { useReportStore, PerformanceReport } from '../../../components/reportStorage';
import { deleteStudentReportsFromFirebase } from '../../../utils/firebase';
import { Timestamp } from 'firebase/firestore';

interface UniqueStudent {
  name: string;
  id?: string | null; 
}

const StudentsList: React.FC = () => {
  const [uniqueStudents, setUniqueStudents] = useState<UniqueStudent[]>([]);
  const [studentToDelete, setStudentToDelete] = useState<UniqueStudent | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  
  const reportsFromStore = useReportStore((state) => state.reports);
  const setReportsInStore = useReportStore((state) => state.setReports);

  useEffect(() => {
    const names = new Map<string, UniqueStudent>();
    reportsFromStore.forEach(report => {
      if (!names.has(report.nome)) {
        names.set(report.nome, { name: report.nome, id: report.studentId });
      }
    });
    const sortedStudents = Array.from(names.values()).sort((a, b) => a.name.localeCompare(b.name));
    setUniqueStudents(sortedStudents);
  }, [reportsFromStore]);

  const confirmDelete = (student: UniqueStudent) => {
    setStudentToDelete(student);
    setShowAlert(true);
  };

  const deleteStudent = async () => {
    if (!studentToDelete) return;
    
    setIsLoading(true);
    
    try {
      await deleteStudentReportsFromFirebase(studentToDelete.name, studentToDelete.id);

      const updatedReports = reportsFromStore.filter(
        report => report.nome !== studentToDelete.name
      );
      setReportsInStore(updatedReports);

      localStorage.setItem("performanceReports", JSON.stringify(updatedReports.map(report => ({
        ...report,
        dataCadastro: report.dataCadastro instanceof Timestamp 
          ? report.dataCadastro.toDate().toISOString() 
          : report.dataCadastro
      }))));

      const savedStudents = localStorage.getItem("students");
      if (savedStudents) {
        const studentsList = JSON.parse(savedStudents);
        const updatedStudents = studentsList.filter(
          (s: any) => s.nome !== studentToDelete.name
        );
        localStorage.setItem("students", JSON.stringify(updatedStudents));
      }
      
      setToastMessage('Aluno e seus relatórios removidos com sucesso!');
      setShowToast(true);
    } catch (error) {
      console.error('Erro ao remover aluno e relatórios:', error);
      setToastMessage('Erro ao remover aluno e relatórios');
      setShowToast(true);
    } finally {
      setStudentToDelete(null);
      setShowAlert(false);
      setIsLoading(false);
    }
  };

  const findLatestReportForStudent = (studentName: string): string | null => {
    const studentReports = reportsFromStore.filter(report => report.nome === studentName);
    
    if (studentReports.length === 0) {
      return null;
    }
    
    const sortedReports = [...studentReports].sort((a, b) => {
      const dateA = a.dataCadastro instanceof Timestamp 
        ? a.dataCadastro.toDate().getTime() 
        : new Date(a.dataCadastro).getTime();
      
      const dateB = b.dataCadastro instanceof Timestamp 
        ? b.dataCadastro.toDate().getTime() 
        : new Date(b.dataCadastro).getTime();
      
      return dateB - dateA;
    });
    
    return sortedReports[0].id;
  };

  const navigateToStudentReport = (student: UniqueStudent) => {
    const reportId = findLatestReportForStudent(student.name);
    
    if (reportId) {
      history.push(`/student-details/${reportId}`);
    } else {
      setToastMessage('Nenhum relatório encontrado para este aluno');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <HeaderTemplate titlePage="Alunos Cadastrados" urlTemplate="/home" />    
      <IonContent className="ion-padding-bottom">
        <div className="pb-20">
          <IonList>
            {uniqueStudents.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                Nenhum aluno cadastrado ainda
              </div>
            ) : (
              uniqueStudents.map((student) => (
                <IonItem key={student.name} className="ion-padding">
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <IonLabel>
                        <h1 className="font-bold">{student.name}</h1>                     
                      </IonLabel>                    
                      <div className="flex items-center space-x-6">                                   
                        <IonButton 
                          fill="clear"
                          onClick={() => navigateToStudentReport(student)}
                          color="secondary"
                        >
                          <IonIcon icon={barChart} slot="icon-only" />
                        </IonButton>                      
                        <IonButton 
                          fill="clear"
                          onClick={() => confirmDelete(student)}
                          color="danger"
                          disabled={isLoading}
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
      <FooterTemplate/>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'Confirmar Exclusão'}
        message={`Deseja realmente excluir o aluno ${studentToDelete?.name}?`}
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
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-4 rounded-lg flex items-center">
            <IonSpinner name="crescent" />
            <span className="ml-2 text-white">Excluindo aluno...</span>
          </div>
        </div>
      )}
    </IonPage>
  );
};

export default StudentsList;

