import { Timestamp } from 'firebase/firestore';

export interface StudentOptionType {
  inputValue?: string;
  nome: string;
  id?: string; 
}

export interface StudentReport {
  id: string;
  name: string;
  latestReportId: string;
  performance?: string;
  intensidade?: number;
  dataCadastro: Timestamp | Date | string;
}

export interface FormData {
  selectedStudent: StudentOptionType | null;
  intensidade: number;
  observacao: string;
  performance: string;
  justificativa: string;
  selectedIcon: string | null;
}

export interface ToastHandlers {
  showToastMessage: (message: string) => void;
}

export interface SyncResult {
  uploaded: number;
  skipped: number;
  errors: number;
}

