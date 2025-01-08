import { IRecaudosIn } from '@application/data/';
import { DEPENDENCY_CONTAINER, TYPES } from '@configuration';
import { PostgresError } from '@domain/exceptions';
import { time, timeEnd } from 'console';
import { injectable } from 'inversify';
import { IDatabase, IMain } from 'pg-promise';
import { pgp } from '../adapter';
import { IRecursosMerged } from './interfaces/IRecursosMerged';

@injectable()
export class RecaudosDao {
    private db = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(TYPES.Pg);

    public async guardarRecaudo(data: IRecaudosIn): Promise<number> {
        let idEquipo = 0;
        let idTransaccion = 0;
        await this.db
            .tx(async (t) => {
                const sqlRecaudo = `INSERT INTO recaudos
                                (id_recaudo, id_medio_pago, fecha_hora_recaudo, valor, terminal, id_tipo_recaudo)
                                VALUES ($/id_recaudo/, $/id_medio_pago/, $/fecha_hora_recaudo/, $/valor/, $/terminal/, $/id_tipo_recaudo/)
                                RETURNING id_recaudo;`;

                await t.one<{ id_recaudo: number }>(sqlRecaudo, {
                    id_recaudo: data.recaudo_id,
                    id_medio_pago: data.medio_pago,
                    fecha_hora_recaudo: data.fecha_hora_accion,
                    valor: data.valor_recaudo,
                    terminal: data.terminal,
                    id_tipo_recaudo: data.origen_recaudo + '-' + data.tipo_recaudo,
                });
                if (data.recursos && data.recursos.length) {
                    const complementarias = data.recursos.map((item) => {
                        return {
                            identificador_recurso: item.valor,
                            id_tipo_recurso: item.tipo,
                            valor: item.detalle,
                            id_recaudo: data.recaudo_id,
                        };
                    });

                    time('recursos');
                    const sqlInsertRecursos = pgp.helpers.insert(
                        complementarias,
                        ['identificador_recurso', 'id_tipo_recurso'],
                        'recursos',
                    );
                    const arrayRecursos = await t.many(
                        sqlInsertRecursos +
                            `ON CONFLICT (identificador_recurso, id_tipo_recurso)
                            DO UPDATE SET id_tipo_recurso=EXCLUDED.id_tipo_recurso 
                            RETURNING id_recurso, identificador_recurso, id_tipo_recurso;`,
                    );
                    timeEnd('recursos');
                    const mergedArrays: IRecursosMerged[] = Object.values(
                        [...complementarias, ...arrayRecursos].reduce((r, o) => {
                            r[o.identificador_recurso] = { ...r[o.identificador_recurso], ...o };
                            return r;
                        }, {}),
                    );
                    if (!arrayRecursos.length) {
                        throw new PostgresError('23505', 'No se insertaron recursos');
                    } else {
                        if (!mergedArrays.length) {
                            throw new Error('No se insertaron recursos- Error al hacer merge de arrays');
                        }
                    }
                    time('guiasRecaudadas');
                    const guiasRecaudadas = mergedArrays.filter((item: any) => item.id_tipo_recurso === 3);
                    if (guiasRecaudadas.length) {
                        const sqlInsertGuiasRecaudadas = pgp.helpers.insert(
                            guiasRecaudadas,
                            ['id_recurso', 'id_recaudo', 'valor'],
                            'guias_recaudadas',
                        );

                        await t.none(sqlInsertGuiasRecaudadas + `ON CONFLICT DO NOTHING`);
                        timeEnd('guiasRecaudadas');
                    }
                    time('recaudosRecursos');
                    const sqlInsertRecaudosRecursos = pgp.helpers.insert(
                        mergedArrays,
                        ['id_recaudo', 'id_recurso'],
                        'recaudos_recursos',
                    );
                    timeEnd('recaudosRecursos');
                    await t.none(sqlInsertRecaudosRecursos + `ON CONFLICT DO NOTHING`);

                    time('transacciones');
                    const sqlTrasacciones = `INSERT INTO transacciones
                    (id_tipo_transaccion, valor_transaccion, fecha_hora_transaccion, ingreso_dinero, id_movimiento, id_recurso)
                    values ($/id_tipo_transaccion/, $/valor_transaccion/, $/fecha_hora_transaccion/, $/ingreso_dinero/, $/id_movimiento/, $/id_recurso/)
                    RETURNING id_transaccion;`;

                    const tipoRecurso1 = mergedArrays.find((item: any) => item.id_tipo_recurso === 1);
                    if (tipoRecurso1 && tipoRecurso1.id_recurso) {
                        idEquipo = tipoRecurso1.id_recurso;
                    }

                    const idTransaccionQuery = await t.oneOrNone<{ id_transaccion: number }>(sqlTrasacciones, {
                        id_tipo_transaccion: 1,
                        valor_transaccion: data.valor_recaudo,
                        fecha_hora_transaccion: data.fecha_hora_accion,
                        ingreso_dinero: true,
                        id_movimiento: data.recaudo_id,
                        id_recurso: idEquipo,
                    });
                    if (idTransaccionQuery) idTransaccion = idTransaccionQuery.id_transaccion;
                    timeEnd('transacciones');
                }
            })
            .catch((error) => {
                console.log('error', JSON.stringify(error));
                throw new PostgresError(error.code, error?.data?.error || error.message);
            });
        return idTransaccion;
    }
    /*public updsertRecaudoSql(recurso: string, idTipoRecurso: number): string {
        const sql = `WITH consultar AS (
                        SELECT id_recurso FROM recursos where identificador_recurso = $/identificador_recurso/ and id_tipo_recurso = $/id_tipo_recurso/
                    ),
                    insertar AS (
                        INSERT INTO recursos (identificador_recurso, id_tipo_recurso)
                        SELECT $/identificador_recurso/, $/id_tipo_recurso/ WHERE 1 NOT IN (SELECT 1 FROM consultar)
                        ON CONFLICT (identificador_recurso, id_tipo_recurso)
                        DO UPDATE SET id_tipo_recurso=EXCLUDED.id_tipo_recurso
                        RETURNING id_recurso
                    ),
                    tmp AS (
                        SELECT id_recurso FROM insertar
                        UNION ALL
                        SELECT id_recurso FROM consultar
                    )
                    SELECT DISTINCT id_recurso FROM tmp;`;

        return as.format(sql, {
            identificador_recurso: recurso,
            id_tipo_recurso: idTipoRecurso,
        });
    }*/
}
