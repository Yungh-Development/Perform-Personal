import { IonContent, IonPage, IonList, IonItem, IonLabel, IonSearchbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import HeaderTemplate from '../../template/header/page';
import FooterTemplate from '../../template/footer/page';
import { svgIcons } from '../../students/constants';
import { useHistory } from 'react-router-dom';

interface StudentData {
  id: string;
  nome: string;
  intensidade: number;
  observacao: string;
  performance: string;
  justificativa: string;
  dataCadastro: string;
}

const ReportList: React.FC = () => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]);

  const history = useHistory();

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => {
        const searchLower = searchTerm.toLowerCase();
        
        return (
          student.nome.toLowerCase().includes(searchLower) ||
          student.performance.toLowerCase().includes(searchLower) ||
          student.intensidade.toString().includes(searchTerm)
        );
      });
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const loadStudents = () => {
    const savedData = localStorage.getItem('studentsData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setStudents(parsedData);
      setFilteredStudents(parsedData);
    }
  };

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    const formatter = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    });
    
    return formatter.format(data).replace(',', '');
  };

  const handleSearch = (event: CustomEvent) => {
    setSearchTerm(event.detail.value || '');
  };

  return (
    <IonPage>
      <HeaderTemplate titlePage="Relatórios" urlTemplate="/home" />    
      <IonContent className="ion-padding-bottom">
        <div className="pb-20">
          <IonSearchbar 
            value={searchTerm}
            onIonChange={handleSearch}
            placeholder="Filtrar por Aluno"
            className="px-4"
          />          
          <IonList>
            {filteredStudents.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                {searchTerm ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado ainda'}
              </div>
            ) : (
            filteredStudents.map((student) => {
            const performanceIcon = svgIcons[student.performance as keyof typeof svgIcons];
            return (
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
                            <p className="flex float-end font-bold">{formatarData(student.dataCadastro)}</p>
                        </IonLabel>      
                    </div>
                  </div>
                </IonItem>
               );
            }))}
          </IonList>
        </div>
      </IonContent>
      <FooterTemplate/>
    </IonPage>
  );
};

export default ReportList;