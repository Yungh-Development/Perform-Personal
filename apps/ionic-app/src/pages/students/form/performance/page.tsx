import { IonContent, IonPage, IonFooter, IonInput, IonItem, IonLabel, IonButton, useIonRouter, IonRange, IonToast } from '@ionic/react';
import React, { useState } from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import "./style.css"
import HeaderTemplate from '../../../template/header/page';

interface StudentData {
  id: string;
  nome: string;
  intensidade: number;
  observacao: string;
  performance: string;
  justificativa: string;
  dataCadastro: string;
}

interface StudentOptionType {
  inputValue?: string;
  nome: string;
  id?: string;
}

const PerformanceForm: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<StudentOptionType | null>(null);
  const [intensidade, setIntensidade] = useState(0);
  const [observacao, setObservacao] = useState('');
  const [performance, setPerformance] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMensagem, setToastMensagem] = useState('');

  const router = useIonRouter();

  const loadStudents = (): StudentOptionType[] => {
    const savedStudents = localStorage.getItem('studentsForm');
    if (savedStudents) {
      return JSON.parse(savedStudents).map((student: any) => ({
        nome: student.nome,
        id: student.id
      }));
    }
    return [];
  };

  const filter = createFilterOptions<StudentOptionType>();

  const handleIconClick = (iconName: string) => {
    setPerformance(iconName);
    setSelectedIcon(iconName);
  };

  const saveLocalStorage = (studentData: StudentData) => {
    try {
      const existingData = localStorage.getItem('studentsData');
      let studentsArray: StudentData[] = [];

      if(existingData) {
        studentsArray = JSON.parse(existingData);
      }

      studentsArray.push(studentData);
      localStorage.setItem('studentsData', JSON.stringify(studentsArray));

      return true;
    } catch (error) {
      console.error("Error saving data on localStorage", error);
      return false;
    }
  }

  const generateLocalFile = (studentData: StudentData) => {
    const dataStr = JSON.stringify(studentData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `aluno_${studentData.nome}_${studentData.id}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent) {
      setToastMensagem("Selecione um aluno primeiro");
      setShowToast(true);
      return;
    }

    const studentData: StudentData = {
      id: Date.now().toString(),
      nome: selectedStudent.nome,
      intensidade,
      observacao,
      performance,
      justificativa,
      dataCadastro: new Date().toISOString()
    };

    const saveSucess = saveLocalStorage(studentData);

    if(saveSucess) {
      generateLocalFile(studentData);

      setToastMensagem("Aluno Cadastrado!");
      setShowToast(true);
      setSelectedStudent(null);
      setIntensidade(0);
      setPerformance('');
      setSelectedIcon(null);
      setJustificativa('');
      setObservacao('');

      setTimeout(() => {
        router.push('./home', 'back', 'push');
      }, 3000);
    } else {
      setToastMensagem("Erro ao Salvar dados");
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <HeaderTemplate titlePage="Novo Relatório" urlTemplate='/home'/>
      <IonContent className="h-screen" >
        <div className="ion-padding ">
          <h2 className="text-xl font-bold mb-6 text-white">Novo aluno</h2>          
          <form onSubmit={handleSubmit} className="h-full w-full">
            <div className="py-3 w-full">
              <IonItem className="mb-4 mt-1" color="page-container">
                <div className="w-full">
                  <Autocomplete
                    value={selectedStudent}
                    onChange={(event, newValue) => {
                      if (typeof newValue === 'string') {
                        setSelectedStudent({
                          nome: newValue,
                        });
                      } else if (newValue && newValue.inputValue) {
                        setSelectedStudent({
                          nome: newValue.inputValue,
                        });
                      } else {
                        setSelectedStudent(newValue);
                      }
                    }}
                    sx={{
                      '& .MuiAutocomplete-inputRoot': {
                        color: 'white', 
                        backgroundColor: '#333',
                        borderRadius: '4px',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#666',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#888', 
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#aaa', 
                      },
                      '& .MuiInputLabel-root': {
                        color: '#ccc', 
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#fff',
                      },
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);
                      const { inputValue } = params;
                      const isExisting = options.some(
                        (option) => inputValue === `${option.nome}`
                      );
                      
                      if (inputValue !== '' && !isExisting) {
                        filtered.push({
                          inputValue,
                          nome: `Adicionar "${inputValue}"`,
                        });
                      }

                      return filtered;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    id="aluno-autocomplete"
                    options={loadStudents()}
                    getOptionLabel={(option) => {
                      if (typeof option === 'string') return option;
                      if (option.inputValue) return option.inputValue;
                      return `${option.nome}`;
                    }}
                    renderOption={(props, option) => (
                      <li {...props} style={{ backgroundColor: '#333', color: 'white' }}>
                        {option.inputValue ? option.nome : `${option.nome}`}
                      </li>
                    )}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Selecione ou digite o nome do aluno"
                        variant="outlined"
                        sx={{
                          '& .MuiSvgIcon-root': {
                            color: 'white',
                          },
                        }}
                      />
                    )}
                    fullWidth
                    componentsProps={{
                      popper: {
                        sx: {
                          '& .MuiAutocomplete-listbox': {
                            backgroundColor: '#333',
                            color: 'white',
                            '& li': {
                              '&:hover': {
                                backgroundColor: '#444',
                              },
                              '&[aria-selected="true"]': {
                                backgroundColor: '#555',
                              },
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
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
      <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMensagem}
          duration={2000}
          position="top"
      /> 
    </IonPage>
  );
};

export default PerformanceForm;