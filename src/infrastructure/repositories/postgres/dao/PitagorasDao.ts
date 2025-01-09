import { DEPENDENCY_CONTAINER, TYPES } from '@configuration';
import { injectable } from 'inversify';
import { IDatabase, IMain } from 'pg-promise';
import { DatabaseError } from '@domain/exceptions';
import { IPitagorasIn } from '@application/data';

@injectable()
export class PitagorasDao {
    private dbCm = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(TYPES.Cm);
    private dbDineros = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(TYPES.Pg);

    public async getDataRecaudo(idTransaccion: number): Promise<IPitagorasIn> {
        try {
            const sql = `SELECT
                    r.fecha_hora_recaudo::date as fecha,
                    r.terminal,
                    MAX(CASE WHEN re.id_tipo_recurso = 1 THEN re.identificador_recurso END) as equipo,
                    MAX(CASE WHEN re.id_tipo_recurso = 2 THEN re.identificador_recurso END) as recibidor,
                    MAX(CASE WHEN re.id_tipo_recurso = 4 THEN re.identificador_recurso END) as numero_aprobacion,
                    r.valor
                FROM recaudos r
                INNER JOIN recaudos_recursos rr on rr.id_recaudo = r.id_recaudo
                INNER JOIN recursos re on rr.id_recurso = re.id_recurso
                WHERE r.id_recaudo = (select id_movimiento from transacciones where id_transaccion = ${idTransaccion})
                    AND re.id_tipo_recurso IN (1,2,4)
                GROUP BY r.fecha_hora_recaudo::date, r.terminal,r.valor;`;

            const data = await this.dbDineros.one(sql);
            return data;
        } catch (error) {
            console.error(`Error al obtener datos de recaudo para la transacción ${idTransaccion}:`, error);
            throw new Error('Error al obtener datos de recaudo.'); // Lanzar error genérico o personalizarlo según el caso
        }
    }

    public async insertPitagoras(data: IPitagorasIn, idTransaccion: number): Promise<number> {
        try {
            return await this.dbCm.tx(async (t1) => {
                const sql = `select * from func_registrar_sesion('dineros','cm-dineros-recaudos') as respuesta`;
                await t1.one(sql);

                try {
                    const result = await t1.one<{ id: number }>(
                        `INSERT INTO public.dineros_recibidor
                    (fecha, terminal, equipo, recibidor, forma_de_pago, numero_aprobacion, valor, usuario)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING id`,
                        [
                            data.fecha,
                            data.terminal,
                            data.equipo,
                            data.recibidor,
                            data.forma_de_pago,
                            data.numero_aprobacion,
                            data.valor,
                            data.usuario,
                        ],
                    );

                    try {
                        await this.dbDineros.tx(async (t2) => {
                            const updateQuery = `UPDATE public.recaudos SET estado=9 WHERE id_recaudo = select id_movimiento from transacciones where id_transaccion = $1`;
                            await t2.none(updateQuery, [idTransaccion]); // Throws if the update fails
                            await t1.query('COMMIT'); // Manually commit dbCm
                        });
                    } catch (dbError) {
                        await t1.query('ROLLBACK');
                        console.error('Rollback dbCm:', dbError, t1);
                        throw dbError; // Re-throw
                    }

                    return result.id;
                } catch (error: any) {
                    console.error('Error en insertPitagoras', error);
                    throw new DatabaseError(error, 'Error al insertar en dineros_recibidor');
                }
            });
        } catch (error: any) {
            console.error('Error en insertPitagoras', error);
            throw new DatabaseError(error, 'Error al insertar en dineros_recibidor');
        }
    }
}
