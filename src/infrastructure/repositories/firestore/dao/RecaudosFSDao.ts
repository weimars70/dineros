import 'reflect-metadata';
import { injectable } from 'inversify';
import { Firestore } from '@google-cloud/firestore';
import { IFirestoreStageResponse } from '../interfaces/IFirestoreStageResponse';
import { DEPENDENCY_CONTAINER, TYPES } from '@configuration';
import { FirestoreRepository } from '@domain/repository';
import { DatabaseError } from '@domain/exceptions';

@injectable()
export class RecaudosFSDao implements FirestoreRepository {
    private readonly firestore = DEPENDENCY_CONTAINER.get<Firestore>(TYPES.Firestore);
    private readonly collection = 'recaudo_temporal_guias';
    async getDataRecaudo(): Promise<IFirestoreStageResponse[]> {
        const recaudos: IFirestoreStageResponse[] = [];
        await this.firestore
            .collection(this.collection)
            .where('estado', 'in', ['pendiente', 'reintentar'])
            .limit(100)
            .get()
            .then((querySnapshot: any) => {
                querySnapshot.forEach((doc: any) => {
                    recaudos.push(doc.data() as IFirestoreStageResponse);
                });
            });
        return recaudos;
    }

    async updateRecaudoEstado(recaudoID: string, error?: string, estado?: string): Promise<void> {
        await this.firestore
            .collection(this.collection)
            .doc(recaudoID)
            .update({
                estado: estado ?? 'error',
                ultimo_error: error ?? null,
            })
            .catch((error) => {
                console.error('Error al actualizar la fecha de creación', 'recaudo', error);
                throw new DatabaseError('Error al actualizar la fecha de creación', error);
            });
    }

    async deleteRecaudo(recaudoID: string): Promise<void> {
        await this.firestore
            .collection(this.collection)
            .doc(recaudoID)
            .delete()
            .catch((error) => {
                console.error('Error al eliminar Recaudo', 'recaudo', error);
                throw new DatabaseError('Error al eliminar Recaudo', error);
            });
    }
}
