import { IonButton, IonContent, IonHeader, IonLabel, IonPage, IonTitle, IonToolbar, IonSpinner, IonList, IonItem } from '@ionic/react';
import { Timestamp } from "firebase/firestore";
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import FooterTemplate from '../template/footer/page';
import { fetchAllReportsFromFirebase } from '../../utils/firebase';
import { useEffect, useState } from 'react';
import GuideModal from './modal/page';
import "../../index.css"
import "../../theme/variables.css";
import { svgIcons } from '../students/constants';
import { getBackgroundColorByIntensity, getForegroundColorByIntensity } from '../../utils/getColor';

interface PerformanceReport {
  id: string;
  nome: string;
  performance?: string;
  intensidade?: number;
  dataCadastro: Timestamp | Date | string;
}

interface StudentReport {
  id: string;
  name: string;
  latestReportId: string;
  performance?: string;
  intensidade?: number;
  dataCadastro: Timestamp | Date | string;
}


const HomePage = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastFourStudents, setLastFourStudents] = useState<StudentReport[]>([]);
  const [loading, setLoading] = useState(true);

    const handleOpenGuide = () => {
    setShowSuccessModal(true);
  };
 

useEffect(() => {
    const loadLastFourStudents = async () => {
      try {
        setLoading(true);
        
        const firebaseReports: PerformanceReport[] = await fetchAllReportsFromFirebase();
        
        const studentsMap = new Map<string, StudentReport>();
        
        firebaseReports.forEach(report => {
          if (!studentsMap.has(report.nome)) {
            studentsMap.set(report.nome, {
              id: report.id,
              name: report.nome,
              latestReportId: report.id,
              performance: report.performance,
              intensidade: report.intensidade,
              dataCadastro: report.dataCadastro
            });
          } else {
            const current = studentsMap.get(report.nome)!;
            const currentDate = current.dataCadastro instanceof Timestamp 
              ? current.dataCadastro.toMillis() 
              : new Date(current.dataCadastro as string | Date).getTime();
            
            const newDate = report.dataCadastro instanceof Timestamp 
              ? report.dataCadastro.toMillis() 
              : new Date(report.dataCadastro as string | Date).getTime();
            
            if (newDate > currentDate) {
              studentsMap.set(report.nome, {
                id: report.id,
                name: report.nome,
                latestReportId: report.id,
                performance: report.performance,
                intensidade: report.intensidade,
                dataCadastro: report.dataCadastro
              });
            }
          }
        });

        const sortedStudents = Array.from(studentsMap.values())
          .sort((a, b) => {
            const dateA = a.dataCadastro instanceof Timestamp 
              ? a.dataCadastro.toMillis() 
              : new Date(a.dataCadastro as string | Date).getTime();
            
            const dateB = b.dataCadastro instanceof Timestamp 
              ? b.dataCadastro.toMillis() 
              : new Date(b.dataCadastro as string | Date).getTime();
            
            return dateB - dateA;
          })
          .slice(0, 4); 
        setLastFourStudents(sortedStudents);
      } catch (error) {
        console.error("Erro ao carregar últimos 4 alunos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLastFourStudents();
  }, []);

  const getPerformanceColor = (performance?: string): string => {
    if (!performance) return "text-gray-500";
    
    switch (performance.toLowerCase()) {
      case "excelente":
        return "text-green-500";
      case "bom":
        return "text-blue-500";
      case "regular":
        return "text-yellow-500";
      case "ruim":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };


  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div className="flex justify-center items-center h-full">
            <IonSpinner name="crescent" />
            <IonLabel className="ml-2">Carregando últimos alunos...</IonLabel>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="bg-blue-600">
          <div className="flex ion-padding my-2">    
            <div className="flex ml-4 justify-center items-center">
              <IonTitle className="text-white text-2xl">Homepage</IonTitle>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding-bottom">
        <div className="pb-20">
          <h2 className="text-xl font-bold mb-4 px-4 pt-4">Últimos 4 Alunos Registrados</h2>
          
          <IonList className="h-full">
            {lastFourStudents.length === 0 ? (
              <div className="text-center text-gray-500 p-4">
                Nenhum aluno encontrado
              </div>
            ) : (
              lastFourStudents.map((student) => {
                const performanceIcon = student.performance ? svgIcons[student.performance as keyof typeof svgIcons] : null;
                return (
                  <IonItem 
                    key={student.latestReportId} 
                    className="h-full"
                    button
                    routerLink={`/student-details/${student.latestReportId}`}
                  >
                    <div className="w-full flex justify-between items-center ion-padding">
                      <IonLabel className="flex-grow">
                        <h2 className="font-bold">{student.name}</h2>
                        {student.performance && (
                          <p className={`text-sm font-medium ${getPerformanceColor(student.performance)}`}>
                            Performance: {student.performance}
                          </p>
                        )}
                        {student.intensidade && (
                          <p className={`text-sm font-medium ${getForegroundColorByIntensity(student.intensidade)}`}>
                            Intensidade: {student.intensidade}/10
                          </p>
                        )}
                      </IonLabel>
                      <div className="flex items-center">
                        {performanceIcon && (
                          <div className="flex-none w-10 text-center">
                            {performanceIcon.icon}
                          </div>
                        )}
                        {student.intensidade && (
                          <div className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${getForegroundColorByIntensity(student.intensidade)}`}>
                            {student.intensidade}
                          </div>
                        )}
                      </div>
                    </div>
                  </IonItem>
                );
              })
            )}
          </IonList>
        </div>
      </IonContent>
      <IonItem className="relative">
           <IonButton 
          onClick={handleOpenGuide}
          fill="clear"
          className="absolute right-4 bottom-4 text-yellow-400"
        >
          <HelpOutlinedIcon className="mr-2" />
        </IonButton>
      </IonItem>
      <FooterTemplate/>

      <GuideModal 
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />
    </IonPage>
  );
};

export default HomePage;