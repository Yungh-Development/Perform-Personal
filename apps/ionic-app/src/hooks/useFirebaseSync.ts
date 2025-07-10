import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useReportStore, PerformanceReport } from '../components/reportStorage';
import { backupReportsToFirebase, fetchAllReportsFromFirebase } from '../utils/firebase';

interface UseFirebaseSyncReturn {
  isSyncing: boolean;
  handleManualSync: (
    onMessage: (message: string) => void
  ) => Promise<void>;
  combineAndDeduplicateReports: (
    localReports: PerformanceReport[], 
    firebaseReports: PerformanceReport[]
  ) => PerformanceReport[];
  saveReportsToLocalStorage: (reports: PerformanceReport[]) => void;
}

export const useFirebaseSync = (): UseFirebaseSyncReturn => {
  const [isSyncing, setIsSyncing] = useState(false);
  
  const reportsFromStore = useReportStore((state) => state.reports);
  const setReportsInStore = useReportStore((state) => state.setReports);

  const saveReportsToLocalStorage = (reports: PerformanceReport[]) => {
    try {
      localStorage.setItem('performanceReports', JSON.stringify(reports.map(report => ({
        ...report,
        dataCadastro: report.dataCadastro instanceof Timestamp 
          ? report.dataCadastro.toDate().toISOString() 
          : report.dataCadastro
      }))));
      
      localStorage.setItem('lastSyncTime', new Date().toISOString());
    } catch (error) {
      console.error("Erro ao salvar relatórios no localStorage:", error);
    }
  };

  const combineAndDeduplicateReports = (
    localReports: PerformanceReport[], 
    firebaseReports: PerformanceReport[]
  ): PerformanceReport[] => {
    const allReports = [...localReports, ...firebaseReports];
    
    const uniqueReports = allReports.reduce((acc, report) => {
      const timestamp = report.dataCadastro instanceof Timestamp 
        ? report.dataCadastro.toMillis() 
        : new Date(report.dataCadastro).getTime();
      
      const key = `${report.studentId || report.nome}_${timestamp}`;
      
      if (!acc.has(key)) {
        acc.set(key, report);
      }
      return acc;
    }, new Map<string, PerformanceReport>());

    return Array.from(uniqueReports.values()).sort((a, b) => {
      const dateA = a.dataCadastro instanceof Timestamp 
        ? a.dataCadastro.toMillis() 
        : new Date(a.dataCadastro).getTime();
      
      const dateB = b.dataCadastro instanceof Timestamp 
        ? b.dataCadastro.toMillis() 
        : new Date(b.dataCadastro).getTime();
      
      return dateB - dateA;
    });
  };

  const handleManualSync = async (onMessage: (message: string) => void) => {
    setIsSyncing(true);
    onMessage("Iniciando backup e atualização...");

    try {
      const backupResult = await backupReportsToFirebase(reportsFromStore);
      onMessage(
        `Backup: ${backupResult.uploaded} enviados, ${backupResult.skipped} pulados, ${backupResult.errors} erros.`
      );
      
      await new Promise(resolve => setTimeout(resolve, 2500));

      onMessage("Buscando dados atualizados...");
      const firebaseReports = await fetchAllReportsFromFirebase();
      
      const combinedReports = combineAndDeduplicateReports(reportsFromStore, firebaseReports);
      
      setReportsInStore(combinedReports);
      saveReportsToLocalStorage(combinedReports);
      
      onMessage(
        `Atualização concluída. ${combinedReports.length} relatórios carregados.`
      );

    } catch (error) {
      console.error("Erro durante a sincronização manual:", error);
      onMessage("Erro na sincronização. Verifique o console.");
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    handleManualSync,
    combineAndDeduplicateReports,
    saveReportsToLocalStorage,
  };
};

