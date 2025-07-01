import { useReportStore } from '../components/reportStorage';

interface StudentOptionType {
  inputValue?: string;
  nome: string;
  id?: string; 
}

interface UseStudentManagerReturn {
  loadStudents: () => StudentOptionType[];
  updateStudentsList: (newStudent: StudentOptionType) => void;
}

export const useStudentManager = (): UseStudentManagerReturn => {
  const reportsFromStore = useReportStore((state) => state.reports);

  const loadStudents = (): StudentOptionType[] => {
    const uniqueNames = new Map<string, StudentOptionType>();
    reportsFromStore.forEach(report => {
      if (!uniqueNames.has(report.nome)) {
        uniqueNames.set(report.nome, { 
          nome: report.nome, 
          id: report.studentId ?? undefined 
        });
      }
    });
    
    if (uniqueNames.size > 0) {
      return Array.from(uniqueNames.values());
    }
    
    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
      try {
        return JSON.parse(savedStudents).map((student: any) => ({
          nome: student.nome,
          id: student.id,
        }));
      } catch (e) { 
        console.error("Erro ao parsear students:", e); 
      }
    }
    
    return [];
  };

  const updateStudentsList = (newStudent: StudentOptionType) => {
    try {
      const savedStudents = localStorage.getItem("students");
      let studentsList: StudentOptionType[] = [];
      
      if (savedStudents) {
        studentsList = JSON.parse(savedStudents);
      }
      
      const studentExists = studentsList.some(
        student => student.nome === newStudent.nome
      );
      
      if (!studentExists) {
        studentsList.push(newStudent);
        localStorage.setItem("students", JSON.stringify(studentsList));
      }
    } catch (error) {
      console.error("Erro ao atualizar lista de alunos:", error);
    }
  };

  return {
    loadStudents,
    updateStudentsList,
  };
};

