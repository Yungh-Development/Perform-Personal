import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  writeBatch,
  orderBy,
  doc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { PerformanceReport } from "../components/reportStorage";

const REPORTS_COLLECTION = "performanceReports";

/**
 * @param reportsToBackup 
 * @returns
 */
export const backupReportsToFirebase = async (
  reportsToBackup: PerformanceReport[]
): Promise<{ uploaded: number; skipped: number; errors: number }> => {
  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  const reportsCollectionRef = collection(db, REPORTS_COLLECTION);
  const batch = writeBatch(db);
  const MAX_BATCH_SIZE = 500;
  let currentBatchSize = 0;

  for (const report of reportsToBackup) {
    try {
      if (!report.nome || !report.dataCadastro) {
        console.warn("Relatório inválido - pulando:", report);
        skipped++;
        continue;
      }

      const reportTimestamp = report.dataCadastro instanceof Timestamp 
        ? report.dataCadastro 
        : Timestamp.fromDate(new Date(report.dataCadastro));

      const q = query(
        reportsCollectionRef,
        where("nome", "==", report.nome),
        where("studentId", "==", report.studentId || null),
        where("dataCadastro", "==", reportTimestamp)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        skipped++;
        continue;
      }

      const { id: _, ...reportData } = report;

      const newDocRef = doc(reportsCollectionRef);
      batch.set(newDocRef, {
        ...reportData,
        dataCadastro: reportTimestamp
      });
      
      uploaded++;
      currentBatchSize++;

      if (currentBatchSize >= MAX_BATCH_SIZE) {
        await batch.commit();
        currentBatchSize = 0;
      }

    } catch (error) {
      console.error("Erro ao processar relatório:", report, error);
      errors++;
    }
  }

  if (currentBatchSize > 0) {
    try {
      await batch.commit();
    } catch (error) {
      console.error("Erro ao commitar batch final:", error);
      errors += currentBatchSize;
      uploaded -= currentBatchSize;
    }
  }

  return { uploaded, skipped, errors };
};

/**
 * @returns
 */
export const fetchAllReportsFromFirebase = async (): Promise<PerformanceReport[]> => {
    const reportsCollectionRef = collection(db, REPORTS_COLLECTION);
    const q = query(reportsCollectionRef, orderBy("dataCadastro", "desc"));
    const fetchedReports: PerformanceReport[] = [];

    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data) {
                const reportData = { ...data, id: doc.id } as PerformanceReport;
                if (!(reportData.dataCadastro instanceof Timestamp)) {
                    if (reportData.dataCadastro && typeof reportData.dataCadastro === "object" && "seconds" in reportData.dataCadastro) {
                        reportData.dataCadastro = new Timestamp((reportData.dataCadastro as any).seconds, (reportData.dataCadastro as any).nanoseconds);
                    } else {
                        console.warn(`Documento ${doc.id} com dataCadastro inválida ao buscar. Usando data atual.`);
                        reportData.dataCadastro = Timestamp.now(); 
                    }
                }
                fetchedReports.push(reportData);
            }
        });
        console.log("Relatórios buscados do Firebase:", fetchedReports.length);
        return fetchedReports;
    } catch (error) {
        console.error("Erro ao buscar todos os relatórios do Firebase:", error);
        throw error; 
    }
};

/**
 * @param reportId 
 */
export const deleteReportFromFirebase = async (reportId: string): Promise<void> => {
  try {
    const reportRef = doc(db, REPORTS_COLLECTION, reportId);
    await deleteDoc(reportRef);
    console.log("Relatório deletado do Firebase:", reportId);
  } catch (error) {
    console.error("Erro ao deletar relatório do Firebase:", error);
    throw error;
  }
};

/**
 * @param studentName 
 * @param studentId
 */
export const deleteStudentReportsFromFirebase = async (studentName: string, studentId?: string | null): Promise<number> => {
  try {
    const reportsCollectionRef = collection(db, REPORTS_COLLECTION);
    let q;
    
    if (studentId) {
      q = query(reportsCollectionRef, where("studentId", "==", studentId));
    } else {
      q = query(reportsCollectionRef, where("nome", "==", studentName));
    }
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("Nenhum relatório encontrado para o aluno:", studentName);
      return 0;
    }
    
    const batch = writeBatch(db);
    let count = 0;
    
    querySnapshot.forEach((docSnapshot) => {
      batch.delete(doc(db, REPORTS_COLLECTION, docSnapshot.id));
      count++;
    });
    
    await batch.commit();
    console.log(`${count} relatórios do aluno ${studentName} deletados do Firebase`);
    return count;
  } catch (error) {
    console.error("Erro ao deletar relatórios do aluno do Firebase:", error);
    throw error;
  }
};

