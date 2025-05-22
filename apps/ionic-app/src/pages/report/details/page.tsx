import { IonContent, IonPage, IonList, IonItem, IonLabel } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import StorageOutlined from '@mui/icons-material/StorageOutlined';
import DehazeOutlined from '@mui/icons-material/DehazeOutlined';
import { useParams } from 'react-router-dom';
import { svgIcons } from '../../students/constants';
import { useHistory } from 'react-router-dom';
import HeaderTemplate from '../../template/header/page';
import FooterTemplate from '../../template/footer/page';
import CustomIntensidade from './customNumber/page';
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
  const [standardReport, setStandardReport] = useState(true);

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

  console.log(records)
  return (
    <IonPage>
      <HeaderTemplate titlePage={student.nome} urlTemplate="/relatorio" />
      <IonContent className="ion-padding-bottom">
        <div className="pb-20 w-full">
          <div className="mb-6">
            <h2 className="text-lg font-semibold p-2">{`Últimos ${records.slice(-5).length} Treinos`}</h2>
            <PerformanceChart 
            data={records.slice(-5).map(record => ({ 
                intensidade: record.intensidade,
                dataCadastro: record.dataCadastro 
            }))} 
            />
          </div>
          <div className="flex w-full justify-between">
            <h2 className="text-lg font-semibold p-2 mt-4 ion-padding">Relatórios</h2>
            <div className="flex mr-8 p-2 mt-4 ion-padding">
              <div className="mr-10" onClick={()=> setStandardReport(false)}>
                {standardReport ? (<StorageOutlined sx={{color: "white"}}/>): (<StorageOutlined sx={{color: "green"}}/>)}
              </div>
              <div onClick={()=> setStandardReport(true)}>
                {standardReport ? (<DehazeOutlined sx={{color: "green"}}/>): (<DehazeOutlined sx={{color: "white"}}/>)}
              </div>
            </div>
          </div>
          {standardReport ? (
            <div>
              <IonList className="ion-padding">
                {records.map((record, index) => {
                  const performanceIcon = svgIcons[record.performance as keyof typeof svgIcons];
                  return (
                    <IonItem key={`report-${index}`} className="" onClick={() => history.push(`/student-details/${student.id}`)}>
                      <div className="w-full flex items-center h-20">
                        <div className="w-full flex justify-between items-center ">
                          <IonLabel>
                            <CustomIntensidade 
                              value={record.intensidade}
                            />
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
                            <p className="flex float-end font-bold">
                              {new Date(record.dataCadastro).toLocaleDateString()}
                            </p>
                          </IonLabel>      
                        </div>
                      </div>
                    </IonItem>
                  );
                })}              
              </IonList>
            </div> ):(
            <div>
              <IonList className="ion-padding">
                {records.map((record, index) => {
                  const performanceIcon = svgIcons[record.performance as keyof typeof svgIcons];
                  return (
                    <IonItem key={`report-${index}`} className="" onClick={() => history.push(`/student-details/${student.id}`)}>
                      <div className="w-full flex flex-col justify-start ion items-center h-full  pt-4">
                        <div className="w-full h-full flex justify-between">
                          <IonLabel>
                            <div className="flex flex-col">
                              <span className="pb-4">Intensidade</span>
                              <CustomIntensidade 
                                value={record.intensidade}
                              />
                            </div>                       
                          </IonLabel>
                          <IonLabel>                            
                            <span>Performance</span>
                            <p className="pt-4">{performanceIcon.icon}</p>
                          </IonLabel>
                          <IonLabel>
                            <div>
                              <p className="flex float-end font-bold pb-4">
                                {new Date(record.dataCadastro).toLocaleDateString()}
                              </p>
                            </div>
                          </IonLabel>      
                        </div>
                        <div className="flex w-full h-full flex-col">       
                          <IonLabel className="py-6">
                            <span className="pb-4">Observação: </span>
                            <p>{record.observacao}</p>
                          </IonLabel>                 
                          <IonLabel className="py-6">
                            <span className="pb-4">Justificativa: </span>
                        
                              <p>{record.justificativa}</p>
                        
                          </IonLabel>                                         
                        </div>                   
                      </div>
                    </IonItem>
                  );
                })}              
              </IonList>
            </div>)}
        </div>
      </IonContent>
      <FooterTemplate />
    </IonPage>
  );
};

export default StudentDetails;