import { IonContent, IonPage, IonList, IonItem, IonLabel, IonCheckbox } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { svgIcons } from '../../students/constants';
import { useHistory } from 'react-router-dom';
import HeaderTemplate from '../../template/header/page';
import FooterTemplate from '../../template/footer/page';
import PerformanceChart from './chart/page';

interface StudentData {
  id: string;
  nome: string;
  intensidade: number;
  observacao: string;
  performance: string;
  justificativa: string;
  dataCadastro: string;
}

const StudentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [records, setRecords] = useState<StudentData[]>([]);

  const history = useHistory();

  useEffect(() => {
    const savedData = localStorage.getItem('studentsData');
    if (savedData) {
      const allStudents = JSON.parse(savedData);
      const studentData = allStudents.find((s: StudentData) => s.id === id);
      const studentRecords = allStudents.filter((s: StudentData) => s.nome === studentData?.nome);
      
      setStudent(studentData);
      setRecords(studentRecords);
    }
  }, [id]);

  if (!student) {
    return <div>Carregando...</div>;
  }

  return (
    <IonPage>
      <HeaderTemplate titlePage={student.nome} urlTemplate="/relatorio" />
      <IonContent className="ion-padding-bottom">
        <div className="pb-20 w-full">      
            <h2 className="text-lg font-semibold p-2">Últimos 5 treinos</h2>
                <div className="flex overflow-x-auto p-2 gap-2 bg-black ion-padding">
            {records.map((record, index) => (
                <div key={index} className="min-w-[80px] p-2 rounded text-center">
                {new Date(record.dataCadastro).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </div>
            ))}
            </div>
                <h2 className="text-lg font-semibold p-2 mt-4">Performancias</h2>
                <div className="grid gap-4 p-2">
                {records.map((record, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                            <span>
                            {new Date(record.dataCadastro).toLocaleDateString('pt-BR', { 
                                day: '2-digit', 
                                month: 'short' 
                            })}
                            </span>
                        </div>                        
                        <PerformanceChart 
                            data={records.map(record => ({
                                intensidade: record.intensidade
                            }))} 
                        />                       
                    </div>
                ))}
            </div>
            <h2 className="text-lg font-semibold p-2 mt-4 ion-padding">Relatórios</h2>
            <IonList>
                {records.map((record, index) => {
                    const performanceIcon = svgIcons[record.performance as keyof typeof svgIcons];
                    return(
                    <IonItem key={student.id} className="ion-padding" onClick={() => history.push(`/student-details/${student.id}`)}>
                    <div className="w-full">
                        <div className="w-full flex justify-between items-center">
                            <IonLabel>
                                <h2>{student.intensidade}</h2>
                            </IonLabel>
                            <IonLabel>                            
                                <div>
                                    {performanceIcon.icon}
                                </div>                         
                            </IonLabel>
                            <IonLabel>
                                <h2 className="font-bold">{student.nome}</h2>                     
                            </IonLabel>
                            <IonLabel>
                                <p className="flex float-end font-bold">{new Date(record.dataCadastro).toLocaleDateString()}</p>
                            </IonLabel>      
                        </div>
                    </div>
                    </IonItem> 
                )})}              
            </IonList>
        </div>
      </IonContent>
      <FooterTemplate />
    </IonPage>
  );
};

export default StudentDetails;