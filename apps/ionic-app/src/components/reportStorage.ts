import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Timestamp } from 'firebase/firestore';

export interface PerformanceReport {
  id: string;
  studentId: string | null;
  nome: string;
  intensidade: number;
  observacao: string;
  performance: string;
  justificativa: string;
  dataCadastro: Timestamp;
}

interface ReportState {
  reports: PerformanceReport[];
  addReport: (report: PerformanceReport) => void;
  setReports: (reports: PerformanceReport[]) => void;
}

const timestampStorageSerializer = {
  getItem: (name: string): string | null => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    return str;
  },
  setItem: (name: string, value: string): void => {
    const state = JSON.parse(value);
    const newState = {
      ...state,
      state: {
        ...state.state,
        reports: state.state.reports.map((report: PerformanceReport) => ({
          ...report,
          dataCadastro: report.dataCadastro instanceof Timestamp 
          ? report.dataCadastro.toDate().toISOString() 
          : report.dataCadastro, 
        })),
      },
    };
    localStorage.setItem(name, JSON.stringify(newState));
  },
  removeItem: (name: string): void => localStorage.removeItem(name),
};

export const useReportStore = create<ReportState>()(
  persist(
    (set) => ({
      reports: [],

      addReport: (report) =>
        set((state) => {
          const reportWithTimestamp = {
            ...report,
            dataCadastro: report.dataCadastro instanceof Date 
                            ? Timestamp.fromDate(report.dataCadastro) 
                            : report.dataCadastro,
          };
          return { reports: [...state.reports, reportWithTimestamp] };
        }),

      setReports: (newReports) =>
        set(() => {
          const reportsWithTimestamps = newReports.map(report => ({
            ...report,
            dataCadastro: report.dataCadastro instanceof Date
              ? Timestamp.fromDate(report.dataCadastro)
              : (typeof report.dataCadastro === 'string' 
              ? Timestamp.fromDate(new Date(report.dataCadastro)) 
              : report.dataCadastro)
          }));
          return { reports: reportsWithTimestamps };
        }),
    }),
    {
      name: 'performance-reports-storage', 
      storage: createJSONStorage(() => localStorage, { 
          reviver: (key, value) => {
              if (key === 'dataCadastro' && typeof value === 'string') {
                  try {
                      return Timestamp.fromDate(new Date(value));
                  } catch (e) {
                      console.error("Erro ao reviver Timestamp:", e, value);
                      return value; 
                  }
              }
              return value;
          },
          replacer: (key, value) => {
              if (value instanceof Timestamp) {
                  return value.toDate().toISOString();
              }
              return value;
          }
      }),
    }
  )
);