import { IFirestoreStageResponse } from '@infrastructure/repositories/firestore/interfaces/IFirestoreStageResponse';

export interface FirestoreRepository {
    getDataRecaudo(): Promise<IFirestoreStageResponse[]>;
    updateRecaudoEstado(recaudoID: string, error?: string, estado?: string): Promise<void>;
    deleteRecaudo(recaudoID: string): Promise<void>;
}
