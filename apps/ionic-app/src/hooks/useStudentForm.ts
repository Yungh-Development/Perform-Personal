import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useReportStore, PerformanceReport } from '../components/reportStorage';

interface StudentOptionType {
  inputValue?: string;
  nome: string;
  id?: string; 
}

interface FormData {
  selectedStudent: StudentOptionType | null;
  intensidade: number;
  observacao: string;
  performance: string;
  justificativa: string;
  selectedIcon: string | null;
}

interface UseStudentFormReturn {
  formData: FormData;
  isSaving: boolean;
  setSelectedStudent: (student: StudentOptionType | null) => void;
  setIntensidade: (value: number) => void;
  setObservacao: (value: string) => void;
  setPerformance: (value: string) => void;
  setJustificativa: (value: string) => void;
  setSelectedIcon: (icon: string | null) => void;
  handleIconClick: (iconName: string) => void;
  handleSubmit: (
    e: React.FormEvent,
    onSuccess: (message: string) => void,
    onError: (message: string) => void
  ) => Promise<void>;
  resetForm: () => void;
}

export const useStudentForm = (): UseStudentFormReturn => {
  const [selectedStudent, setSelectedStudent] = useState<StudentOptionType | null>(null);
  const [intensidade, setIntensidade] = useState(0);
  const [observacao, setObservacao] = useState("");
  const [performance, setPerformance] = useState("");
  const [justificativa, setJustificativa] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const addReportToStore = useReportStore((state) => state.addReport);
  const reportsFromStore = useReportStore((state) => state.reports);

  const handleIconClick = (iconName: string) => {
    setPerformance(iconName);
    setSelectedIcon(iconName);
  };

  const resetForm = () => {
    setSelectedStudent(null);
    setIntensidade(0);
    setPerformance("");
    setSelectedIcon(null);
    setJustificativa("");
    setObservacao("");
  };

  const validateForm = (): { isValid: boolean; message: string } => {
    if (!selectedStudent) {
      return { isValid: false, message: "Selecione um aluno primeiro" };
    }
    if (!performance) {
      return { isValid: false, message: "Selecione a performance do aluno" };
    }
    return { isValid: true, message: "" };
  };

  const handleSubmit = async (
    e: React.FormEvent,
    onSuccess: (message: string) => void,
    onError: (message: string) => void
  ) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.isValid) {
      onError(validation.message);
      return;
    }

    setIsSaving(true);

    const newReport: PerformanceReport = {
      id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      studentId: selectedStudent!.id ?? null,
      nome: selectedStudent!.nome,
      intensidade,
      observacao,
      performance,
      justificativa,
      dataCadastro: Timestamp.now(),
    };

    try {
      addReportToStore(newReport);
      
      const savedStudents = localStorage.getItem("students");
      let studentsList: StudentOptionType[] = [];
      
      if (savedStudents) {
        studentsList = JSON.parse(savedStudents);
      }
      
      const studentExists = studentsList.some(
        student => student.nome === selectedStudent!.nome
      );
      
      if (!studentExists) {
        studentsList.push(selectedStudent!);
        localStorage.setItem("students", JSON.stringify(studentsList));
      }
      
      const currentReports = [...reportsFromStore, newReport];
      localStorage.setItem('performanceReports', JSON.stringify(currentReports.map(report => ({
        ...report,
        dataCadastro: report.dataCadastro instanceof Timestamp 
          ? report.dataCadastro.toDate().toISOString() 
          : report.dataCadastro
      }))));
      
      localStorage.setItem('lastSyncTime', new Date().toISOString());

      resetForm();
      onSuccess("Relatório salvo localmente com sucesso!");

    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
      onError("Erro ao salvar relatório localmente.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData: {
      selectedStudent,
      intensidade,
      observacao,
      performance,
      justificativa,
      selectedIcon,
    },
    isSaving,
    setSelectedStudent,
    setIntensidade,
    setObservacao,
    setPerformance,
    setJustificativa,
    setSelectedIcon,
    handleIconClick,
    handleSubmit,
    resetForm,
  };
};

