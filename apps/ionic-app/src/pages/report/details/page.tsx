import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonSpinner,
  IonButton,
  IonIcon,
  IonToast,
} from "@ionic/react";
import React, { useEffect, useState, useCallback } from "react";
import StorageOutlined from "@mui/icons-material/StorageOutlined";
import DehazeOutlined from "@mui/icons-material/DehazeOutlined";
import { useParams } from "react-router-dom";
import { svgIcons } from "../../students/constants"; 
import HeaderTemplate from "../../template/header/page"; 
import FooterTemplate from "../../template/footer/page";
import CustomIntensidade from "./customNumber/page";
import PerformanceChart from "./chart/page"; 

import { db } from "../../../firebaseConfig"; 
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
} from "firebase/firestore";

import { useReportStore, PerformanceReport } from "../../../components/reportStorage";
import { backupReportsToFirebase, fetchAllReportsFromFirebase } from "../../../utils/firebase";


interface StudentDetailsData extends PerformanceReport {}

const mapToStudentDetailsData = (id: string, rawData: any): StudentDetailsData => {
    let timestamp: Timestamp | Date | string;
    const rawTimestamp = rawData?.dataCadastro;

    if (rawTimestamp instanceof Timestamp) {
        timestamp = rawTimestamp;
    } else if (rawTimestamp && typeof rawTimestamp === "object" && "seconds" in rawTimestamp && "nanoseconds" in rawTimestamp) {
        try {
            timestamp = new Timestamp(rawTimestamp.seconds, rawTimestamp.nanoseconds);
        } catch (e) { 
            console.error("Erro ao criar Timestamp a partir de objeto:", e);
            timestamp = Timestamp.fromDate(new Date(0));
        }
    } else if (typeof rawTimestamp === "string") {
        try {
            const date = new Date(rawTimestamp);
            if (!isNaN(date.getTime())) {
                timestamp = Timestamp.fromDate(date);
            } else {
                timestamp = Timestamp.fromDate(new Date(0)); 
            }
        } catch (e) { 
            console.error("Erro ao criar Timestamp a partir de string:", e);
            timestamp = Timestamp.fromDate(new Date(0))
        }
    } else {
        timestamp = Timestamp.fromDate(new Date(0)); 
    }

    return {
        id: id,
        studentId: rawData?.studentId ?? null,
        nome: rawData?.nome ?? "Nome Indefinido",
        intensidade: rawData?.intensidade ?? 0,
        observacao: rawData?.observacao ?? "",
        performance: rawData?.performance ?? "Desconhecida",
        justificativa: rawData?.justificativa ?? "",
        dataCadastro: timestamp, 
    };
};

const StudentDetails: React.FC = () => {
  const { id: reportId } = useParams<{ id: string }>();
  const [studentReport, setStudentReport] = useState<StudentDetailsData | null>(null);
  const [historyRecords, setHistoryRecords] = useState<StudentDetailsData[]>([]);
  const [standardReportView, setStandardReportView] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const reportsFromStore = useReportStore((state) => state.reports);
  const setReportsInStore = useReportStore((state) => state.setReports);

  const formatarData = (timestampInput: any): string => {
    let timestamp: Timestamp | null = null;
    if (timestampInput instanceof Timestamp) {
      timestamp = timestampInput;
    } else if (typeof timestampInput === "string") {
      try {
        const date = new Date(timestampInput);
        if (!isNaN(date.getTime())) {
          timestamp = Timestamp.fromDate(date);
        }
      } catch {}
    } else if (
      typeof timestampInput === "object" &&
      timestampInput !== null &&
      "seconds" in timestampInput &&
      "nanoseconds" in timestampInput
    ) {
      try {
        timestamp = new Timestamp(
          timestampInput.seconds,
          timestampInput.nanoseconds
        );
      } catch {}
    }

    if (timestamp) {
      try {
        const data = timestamp.toDate();
        const formatter = new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        });
        return formatter.format(data).replace(",", " "); 
      } catch (e) {
        console.error("Erro ao formatar Timestamp válido:", e, timestamp);
        return "Erro fmt";
      }
    } else {
      return "Inválida";
    }
  };

  const combineAndDeduplicateReports = useCallback((localReports: PerformanceReport[], firebaseReports: PerformanceReport[]): PerformanceReport[] => {
    const allReports = [...localReports, ...firebaseReports];
    const uniqueReportsMap = new Map<string, PerformanceReport>();

    allReports.forEach(report => {
      const reportDate = report.dataCadastro instanceof Timestamp 
        ? report.dataCadastro.toMillis() 
        : new Date(report.dataCadastro).getTime();
      
      const key = `${report.studentId || report.nome}-${reportDate}`;

      uniqueReportsMap.set(key, report);
    });

    return Array.from(uniqueReportsMap.values()).sort((a, b) => {
      const dateA = a.dataCadastro instanceof Timestamp 
        ? a.dataCadastro.toMillis() 
        : new Date(a.dataCadastro).getTime();
      
      const dateB = b.dataCadastro instanceof Timestamp 
        ? b.dataCadastro.toMillis() 
        : new Date(b.dataCadastro).getTime();
      
      return dateB - dateA; 
    });
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    let currentReport: StudentDetailsData | null = null;
    let combinedHistory: PerformanceReport[] = []; 

    try {
      const docRef = doc(db, "performanceReports", reportId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        currentReport = mapToStudentDetailsData(docSnap.id, docSnap.data());
        console.log("Relatório principal encontrado no Firebase:", currentReport);
      } else {
        const localReportRaw = reportsFromStore.find((r) => r.id === reportId);
        if (localReportRaw) {
          currentReport = mapToStudentDetailsData(localReportRaw.id, localReportRaw);
          console.log("Relatório principal encontrado localmente:", currentReport);
        } else {
          console.error(`Relatório com ID ${reportId} não encontrado localmente nem no Firebase.`);
          setError("Relatório não encontrado.");
          setStudentReport(null);
          setHistoryRecords([]);
          setLoading(false);
          return;
        }
      }

      if (currentReport) {
        setStudentReport(currentReport);

        const reportsCollection = collection(db, "performanceReports");
        let q;
        if (currentReport.studentId) {
            q = query(
                reportsCollection,
                where("studentId", "==", currentReport.studentId),
                orderBy("dataCadastro", "desc")
            );
        } else {
             q = query(
                reportsCollection,
                where("nome", "==", currentReport.nome),
                orderBy("dataCadastro", "desc")
            );
        }
        
        const querySnapshot = await getDocs(q);
        const firebaseHistory = querySnapshot.docs.map((d) => mapToStudentDetailsData(d.id, d.data()));

        const localHistory = reportsFromStore
          .filter(
            (r) =>
              r.nome === currentReport?.nome ||
              (currentReport?.studentId && r.studentId === currentReport.studentId)
          )
          .map(r => mapToStudentDetailsData(r.id, r));

        combinedHistory = combineAndDeduplicateReports(
          localHistory, 
          firebaseHistory
        );
        setHistoryRecords(combinedHistory); 
      }

    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError("Erro ao carregar dados. Verifique a conexão.");
      setStudentReport(null);
      setHistoryRecords([]);
    } finally {
      setLoading(false);
    }
  }, [reportId, reportsFromStore, combineAndDeduplicateReports]);

  const handleSync = async () => {
    setIsSyncing(true);
    setToastMessage("Iniciando backup e atualização...");
    setShowToast(true);
    try {
      const backupResult = await backupReportsToFirebase(reportsFromStore);
      setToastMessage(
        `Backup: ${backupResult.uploaded} enviados, ${backupResult.skipped} pulados, ${backupResult.errors} erros.`
      );
      setShowToast(true);
      await new Promise(resolve => setTimeout(resolve, backupResult.errors > 0 ? 3500 : 2500));

      setToastMessage("Buscando dados atualizados...");
      setShowToast(true);
      const firebaseReports = await fetchAllReportsFromFirebase();
      
      const combinedAndDeduplicated = combineAndDeduplicateReports(reportsFromStore, firebaseReports);
      setReportsInStore(combinedAndDeduplicated);
      
      setToastMessage(
        `Atualização concluída. ${combinedAndDeduplicated.length} relatórios carregados.`
      );
      setShowToast(true);
      
      await fetchData(); 

    } catch (error) {
      console.error("Erro durante a sincronização manual (detalhes):", error);
      setToastMessage("Erro na sincronização. Verifique o console.");
      setShowToast(true);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (reportId) {
      fetchData();
    }
  }, [reportId, fetchData]);

  if (loading) {
    return (
      <IonPage>
        <HeaderTemplate titlePage="Carregando..." urlTemplate="/relatorio" />
        <IonContent className="ion-padding-bottom">
          <div className="flex justify-center items-center h-full">
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
        <FooterTemplate />
      </IonPage>
    );
  }

  if (error || !studentReport) {
    return (
      <IonPage>
        <HeaderTemplate titlePage="Erro" urlTemplate="/relatorio" />
        <IonContent className="ion-padding-bottom">
          <div className="flex flex-col justify-center items-center h-full text-center p-8">
            <IonNote color="danger" className="text-lg mb-4">
              {error || "Relatório não encontrado"}
            </IonNote>
            <IonButton onClick={fetchData} color="primary" fill="outline">
              Tentar novamente
            </IonButton>
          </div>
        </IonContent>
        <FooterTemplate />
      </IonPage>
    );
  }

  return (
    <IonPage>
      <HeaderTemplate
        titlePage={studentReport.nome} 
        urlTemplate="/relatorio"
        showSyncButton={true}
        onSyncClick={handleSync}
        isSyncing={isSyncing}
      />
      <IonContent className="ion-padding-bottom">
        <div className="pb-20 w-full">
          <div className="mb-6">
            <h2 className="text-lg font-semibold p-2">
              {`Últimos ${Math.min(5, historyRecords.length)} Treinos`}
            </h2>
            {historyRecords.length > 0 ? (
                <PerformanceChart
                  data={historyRecords.slice(0, 5).map((record) => ({
                    intensidade: record.intensidade,
                    dataCadastro: formatarData(record.dataCadastro),
                  }))}
                />
            ) : (
                <div className="text-center p-4 text-gray-500">Sem histórico para exibir gráfico.</div>
            )}
          </div>
          <div className="flex w-full justify-between items-center">
            <h2 className="text-lg font-semibold p-2 mt-4 ion-padding">Histórico</h2>
            <div className="flex mr-8 p-2 mt-4 ion-padding">
              <div className="mr-10" onClick={() => setStandardReportView(false)}>
                {standardReportView ? (
                  <StorageOutlined sx={{ color: "white" }} />
                ) : (
                  <StorageOutlined sx={{ color: "green" }} />
                )}
              </div>
              <div onClick={() => setStandardReportView(true)}>
                {standardReportView ? (
                  <DehazeOutlined sx={{ color: "green" }} />
                ) : (
                  <DehazeOutlined sx={{ color: "white" }} />
                )}
              </div>
            </div>
          </div>
          {historyRecords.length === 0 && !loading && (
              <div className="text-center p-8 text-gray-500">Nenhum histórico encontrado para este aluno.</div>
          )}
          {standardReportView ? (
            <IonList className="ion-padding">
              {historyRecords.map((record) => (
                <IonItem key={`hist-${record.id}`}>
                  <div className="w-full flex items-center h-20">
                    <div className="w-full flex justify-between items-center">
                      <IonLabel className="flex-none w-12 text-center">
                        <CustomIntensidade value={record.intensidade} />
                      </IonLabel>
                      <IonLabel className="flex-none w-10 text-center">
                        <div>
                          {svgIcons[record.performance as keyof typeof svgIcons]?.icon || <IonNote>?</IonNote>}
                        </div>
                      </IonLabel>
                      <IonLabel className="flex-grow text-right">
                        <p className="text-sm font-bold">
                          {formatarData(record.dataCadastro)}
                        </p>
                      </IonLabel>
                    </div>
                  </div>
                </IonItem>
              ))}
            </IonList>
          ) : (
            <IonList className="ion-padding">
              {historyRecords.map((record) => (
                <IonItem key={`hist-detail-${record.id}`}>
                  <div className="w-full flex flex-col justify-start items-start h-full pt-4">
                    <div className="w-full h-full flex justify-between items-start mb-4">
                      <IonLabel className="flex-grow basis-1/3">
                        <div className="flex flex-col">
                          <span className="pb-2 text-sm text-gray-400">Intensidade</span>
                          <CustomIntensidade value={record.intensidade} />
                        </div>
                      </IonLabel>
                      <IonLabel className="flex-grow basis-1/3 text-center">
                        <span className="text-sm text-gray-400">Performance</span>
                        <p className="pt-2">
                          {svgIcons[record.performance as keyof typeof svgIcons]?.icon}
                        </p>
                      </IonLabel>
                      <IonLabel className="flex-grow basis-1/3 text-right">
                        <div className="flex flex-col items-end">
                            <span className="pb-2 text-sm text-gray-400">Data</span>
                            <p className="font-bold">
                            {formatarData(record.dataCadastro)}
                            </p>
                        </div>
                      </IonLabel>
                    </div>
                    <div className="flex w-full h-full flex-col mt-2 border-t border-gray-700 pt-4">
                      <IonLabel className="mb-4">
                        <span className="text-sm text-gray-400">Observação: </span>
                        <p className="mt-1 text-white">{record.observacao || "-"}</p>
                      </IonLabel>
                      <IonLabel>
                        <span className="text-sm text-gray-400">Justificativa: </span>
                        <p className="mt-1 text-white">{record.justificativa || "-"}</p>
                      </IonLabel>
                    </div>
                  </div>
                </IonItem>
              ))}
            </IonList>
          )}
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

export default StudentDetails;