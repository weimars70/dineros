import 'reflect-metadata';
import { injectable } from 'inversify';
import axios from 'axios';
import { IResponseAliados } from './interfaces/IResponseAliados';
import { IFirestoreStageResponse } from '@infrastructure/repositories/firestore/interfaces/IFirestoreStageResponse';
import { TRANSACCIONES_URL } from '@util';

@injectable()
export class TransaccionesApiClient {
    async postRecaudosTarea(data: IFirestoreStageResponse): Promise<IResponseAliados | null> {
        try {
            console.log('postRecaudosTarea', data);
            const response = await axios<IResponseAliados>({
                method: 'post',
                url: `${TRANSACCIONES_URL}recaudos/procesar`,
                data,
            });
            response.data.statusCode = response.status;
            return response.data;
        } catch (error: any) {
            console.error('Error al procesar recaudo', error.response.data);
            return {
                isError: true,
                date: error.response.data.details,
                data: 'null',
                message: error.response.data.message,
                statusCode: error.response.data.statusCode,
            };
        }
    }
}
