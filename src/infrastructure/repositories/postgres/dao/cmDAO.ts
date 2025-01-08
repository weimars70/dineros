import { DEPENDENCY_CONTAINER, TYPES } from '@configuration';
import { injectable } from 'inversify';
import { IDatabase, IMain } from 'pg-promise';
import { IRecaudosConsulta } from '@application/data/in/IRecaudosConsulta';
import { IConsultarRecaudoResponse, IHistoricoResponse } from './interfaces/IConsultarRecaudoResponse';
import { DatabaseError } from '@domain/exceptions';

@injectable()
export class cmDAO {
    private db = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(TYPES.cm);

    public async consultaRecaudoRCE(data: IRecaudosConsulta): Promise<IConsultarRecaudoResponse | null> {
        try {
            const response = await this.db.oneOrNone<IConsultarRecaudoResponse>(
                'SELECT fechahora_recaudo FROM recaudos where codigo_remision = $1 LIMIT 1',
                data.codigo_remision,
            );
            return response;
        } catch (error: any) {
            console.error('Error en consultaRecaudoRCE', error);
            throw new DatabaseError(error, 'Error en consultaRecaudoRCE');
        }
    }

    public async consultaHistoricoPagos(data: IRecaudosConsulta): Promise<IHistoricoResponse | null> {
        try {
            const response = await this.db.oneOrNone<IHistoricoResponse>(
                'select codigo_remision from historico_pagos where codigo_remision = $1 LIMIT 1',
                data.codigo_remision,
            );
            return response;
        } catch (error: any) {
            console.error('Error en consultaRecaudoRCE', error);
            throw new DatabaseError(error, 'Error en consultaRecaudoRCE');
        }
    }
}
