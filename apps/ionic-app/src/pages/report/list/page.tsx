import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonSearchbar,
  IonNote,
  IonToast,
  IonSpinner
} from "@ionic/react";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import HeaderTemplate from "../../template/header/page";
import FooterTemplate from "../../template/footer/page";
import { svgIcons } from "../../students/constants";
import { useReportStore, PerformanceReport } from "../../../components/reportStorage";
import { backupReportsToFirebase, fetchAllReportsFromFirebase } from "../../../utils/firebase";
import { Timestamp } from "firebase/firestore";

interface StudentReport {
  id: string;
  name: string;
  latestReportId: string;
  performance?: string;
  intensidade?: number;
  dataCadastro: Timestamp | Date | string;
}

const ReportListZustand_v2: React.FC = () => {
  const reportsFromStore = useReportStore((state) => state.reports);
  const setReportsInStore = useReportStore((state) => state.setReports);
  const [uniqueStudents, setUniqueStudents] = useState<StudentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadReportsFromLocalStorage = (): PerformanceReport[] => {
    try {
      const cachedReports = localStorage.getItem("performanceReports");
      if (!cachedReports) return [];
      
      return JSON.parse(cachedReports).map((report: any) => ({
        ...report,
        dataCadastro: typeof report.dataCadastro === "string" 
          ? Timestamp.fromDate(new Date(report.dataCadastro))
          : report.dataCadastro
      }));
    } catch (error) {
      console.error("Erro ao carregar relatórios do localStorage:", error);
      return [];
    }
  };

  const saveReportsToLocalStorage = (reports: PerformanceReport[]) => {
    try {
      localStorage.setItem("performanceReports", JSON.stringify(reports.map(report => ({
        ...report,
        dataCadastro: report.dataCadastro instanceof Timestamp 
          ? report.dataCadastro.toDate().toISOString() 
          : report.dataCadastro
      }))));
      
      localStorage.setItem("lastSyncTime", new Date().toISOString());
    } catch (error) {
      console.error("Erro ao salvar relatórios no localStorage:", error);
    }
  };

  const combineAndDeduplicateReports = useCallback((localReports: PerformanceReport[], firebaseReports: PerformanceReport[]): PerformanceReport[] => {
    const reportsMap = new Map<string, PerformanceReport>();
    
    firebaseReports.forEach(report => {
      if (report.id && !reportsMap.has(report.id)) {
        reportsMap.set(report.id, report);
      }
    });
    
    localReports.forEach(report => {
      if (report.id && !reportsMap.has(report.id)) {
        reportsMap.set(report.id, report);
      }
    });
    
    return Array.from(reportsMap.values()).sort((a, b) => {
      const dateA = a.dataCadastro instanceof Timestamp 
        ? a.dataCadastro.toMillis() 
        : new Date(a.dataCadastro as string | Date).getTime();
      
      const dateB = b.dataCadastro instanceof Timestamp 
        ? b.dataCadastro.toMillis() 
        : new Date(b.dataCadastro as string | Date).getTime();
      
      return dateB - dateA;
    });
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        const cachedReports = loadReportsFromLocalStorage();
        
        if (cachedReports.length > 0) {
          setReportsInStore(cachedReports);
        }
        
        try {
          const firebaseReports = await fetchAllReportsFromFirebase();
          const currentReportsInStore = useReportStore.getState().reports;
          const combinedReports = combineAndDeduplicateReports(currentReportsInStore, firebaseReports);

          setReportsInStore(combinedReports);
          saveReportsToLocalStorage(combinedReports);
        } catch (error) {
          console.error("Erro ao buscar dados do Firebase:", error);
          if (cachedReports.length === 0) {
            setToastMessage("Erro ao carregar dados do Firebase. Verifique sua conexão.");
            setShowToast(true);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        setToastMessage("Erro ao carregar dados");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [setReportsInStore, combineAndDeduplicateReports]);

  useEffect(() => {
    const studentsMap = new Map<string, StudentReport>();
    
    reportsFromStore.forEach(report => {
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

    const sortedStudents = Array.from(studentsMap.values()).sort((a, b) => {
      const dateA = a.dataCadastro instanceof Timestamp 
        ? a.dataCadastro.toMillis() 
        : new Date(a.dataCadastro as string | Date).getTime();
      
      const dateB = b.dataCadastro instanceof Timestamp 
        ? b.dataCadastro.toMillis() 
        : new Date(b.dataCadastro as string | Date).getTime();
      
      return dateB - dateA;
    });

    setUniqueStudents(sortedStudents);
  }, [reportsFromStore]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setToastMessage("Iniciando sincronização...");
    setShowToast(true);

    try {
      const currentReportsInStore = useReportStore.getState().reports; 
      const result = await backupReportsToFirebase(currentReportsInStore);
      setToastMessage(`${result.uploaded} relatórios enviados para o Firebase`);
      setShowToast(true);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setToastMessage("Buscando dados atualizados...");
      setShowToast(true);
      
      const firebaseReports = await fetchAllReportsFromFirebase();
      const combinedReports = combineAndDeduplicateReports(currentReportsInStore, firebaseReports);
      
      setReportsInStore(combinedReports);
      saveReportsToLocalStorage(combinedReports);
      
      setToastMessage(`Sincronização concluída. ${combinedReports.length} relatórios disponíveis.`);
    } catch (error) {
      console.error("Erro na sincronização:", error);
      setToastMessage("Erro ao sincronizar com o Firebase");
    } finally {
      setIsSyncing(false);
      setShowToast(true);
    }
  };

  const formatDate = (dateInput: unknown): string => {
    try {
      if (!dateInput) return "Sem data";
      
      let date: Date;

      if (dateInput instanceof Timestamp) {
        date = dateInput.toDate();
      } else if (typeof dateInput === "string") {
        date = new Date(dateInput);
      } else if (dateInput instanceof Date) {
        date = dateInput;
      } else {
        return "Data inválida";
      }

      if (isNaN(date.getTime())) return "Data inválida";

      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
    } catch {
      return "Data inválida";
    }
  };

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return uniqueStudents;
    
    const term = searchTerm.toLowerCase();
    return uniqueStudents.filter(student => 
      student.name.toLowerCase().includes(term) ||
      (student.performance && student.performance.toLowerCase().includes(term)) ||
      (student.intensidade && student.intensidade.toString().includes(searchTerm))
    );
  }, [uniqueStudents, searchTerm]);

  if (loading) {
    return (
      <IonPage>
        <HeaderTemplate 
          titlePage="Relatórios"
          urlTemplate="/home" 
          showSyncButton={false}
        />
        <IonContent className="ion-padding-bottom">
          <div className="flex justify-center items-center h-full">
            <IonSpinner name="crescent" />
            <IonLabel className="ml-2">Carregando dados...</IonLabel>
          </div>
        </IonContent>
        <FooterTemplate />
      </IonPage>
    );
  }

  return (
    <IonPage>
      <HeaderTemplate 
        titlePage="Relatórios"
        urlTemplate="/home" 
        showSyncButton={true}
        onSyncClick={handleManualSync}
        isSyncing={isSyncing}
      />
      <IonContent className="ion-padding-bottom">
        <div className="pb-20">
          <IonSearchbar
            value={searchTerm}
            onIonChange={(e) => setSearchTerm(e.detail.value || "")}
            placeholder="Filtrar por Aluno, Performance..."
            className="px-4 pt-2 pb-2"
            debounce={300}
          />
          <IonList>
            {filteredStudents.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                {searchTerm
                  ? "Nenhum aluno encontrado para o filtro"
                  : "Nenhum aluno cadastrado ainda"
                }
              </div>
            ) : (
              filteredStudents.map((student) => {
                const performanceIcon = student.performance ? svgIcons[student.performance as keyof typeof svgIcons] : null;
                return (
                  <IonItem 
                    key={student.latestReportId} 
                    className="ion-padding"
                    button
                    routerLink={`/student-details/${student.latestReportId}`}
                  >
                    <div className="w-full flex justify-between items-center">
                      <IonLabel className="flex-grow">
                        <h2 className="font-bold">{student.name}</h2>
                        <p className="text-sm text-gray-500">
                          {formatDate(student.dataCadastro)}
                        </p>
                      </IonLabel>
                      <div className="flex items-center space-x-4">
                        {performanceIcon && (
                          <div className="flex-none w-10 text-center">
                            {performanceIcon.icon}
                          </div>
                        )}
                        {student.intensidade !== undefined && (
                          <div className="flex-none w-8 text-center">
                            <h2 className="font-bold text-lg">{student.intensidade}</h2>
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
      <FooterTemplate />
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="top"
        color={toastMessage.toLowerCase().includes("erro") ? "danger" : "success"}
      />
    </IonPage>
  );
};

export default ReportListZustand_v2;