import { DataType, IMemoryDb, newDb } from 'pg-mem';
import { TABLAS_DINEROS, TABLAS_PITAGORAS } from '../tablas';
import {
    insertarAliadosEquipos,
    insertarBolsillo,
    insertarBolsilloDia,
    insertarInconsistencia,
    insertarLegalizacion,
    insertarMediosPago,
    insertarRecaudo,
    insertarRecursos,
    insertarTiposNovedades,
    insertarTiposRecaudos,
    insertarTiposRecursos,
    insertarTiposTransacciones,
    insertarTransaccion,
    insertarTraslado,
    insertarDinerosRecibidor,
} from '../data';
import moment from 'moment-timezone';

export const DBDinerosMem = () => {
    const dbmem = newDb();
    dbmem.createSchema('novedades');

    //Base
    inicializarTablas(dbmem);
    configurarFunciones(dbmem);
    poblarInformacion(dbmem);

    // Interceptor
    //configurarInterceptores(dbmem);

    const pg = dbmem.adapters.createPgPromise();
    pg.connect();
    return pg;
};

const inicializarTablas = (bdmen: IMemoryDb) => {
    TABLAS_DINEROS.generarTablaTiposRecursos(bdmen);
    TABLAS_DINEROS.generarTablaRecursos(bdmen);
    TABLAS_DINEROS.generarTablaBolsilloDia(bdmen);
    TABLAS_DINEROS.generarTablaBolsillo(bdmen);
    TABLAS_DINEROS.generarTablaInconsistencia(bdmen);
    TABLAS_DINEROS.generarReciboCaja(bdmen);
    TABLAS_DINEROS.generarSecuenciaTraslados(bdmen);
    TABLAS_DINEROS.generarTablaTraslados(bdmen);
    TABLAS_DINEROS.generarTablaLegalizaciones(bdmen);
    TABLAS_DINEROS.generarTablaRecursoTransaccionesTraslado(bdmen);
    TABLAS_DINEROS.generarTablaTiposRecaudos(bdmen);
    TABLAS_DINEROS.generarTablaMediosPagos(bdmen);
    TABLAS_DINEROS.generarTablaRecaudos(bdmen);
    TABLAS_DINEROS.generarTablaRecaudoBolsillo(bdmen);
    TABLAS_DINEROS.generarTablaInconsistenciaBolsillo(bdmen);
    TABLAS_DINEROS.generarTablaTiposTransacciones(bdmen);
    TABLAS_DINEROS.generarTablaTransacciones(bdmen);
    TABLAS_DINEROS.generarTablaAliadosEquipos(bdmen);
    TABLAS_DINEROS.generarTablaRecaudosRecursos(bdmen);
    TABLAS_DINEROS.generarTablaTiposNovedades(bdmen);
    TABLAS_DINEROS.generarTablaNovedades(bdmen);
    TABLAS_PITAGORAS.generarTablaDinerosRecibidor(bdmen);
};

const poblarInformacion = (dbmem: IMemoryDb) => {
    //Agregar datos a las tablas
    insertarTiposRecursos(dbmem);
    insertarRecursos(dbmem);
    insertarInconsistencia(dbmem);
    insertarBolsillo(dbmem);
    insertarBolsilloDia(dbmem);
    insertarTraslado(dbmem);
    insertarLegalizacion(dbmem);
    insertarTiposTransacciones(dbmem);
    insertarTiposRecaudos(dbmem);
    insertarMediosPago(dbmem);
    insertarRecaudo(dbmem);
    insertarTransaccion(dbmem);
    insertarAliadosEquipos(dbmem);
    insertarTiposNovedades(dbmem);
    insertarDinerosRecibidor(dbmem);
};

const configurarFunciones = (dbmem: IMemoryDb) => {
    dbmem.public.registerFunction({
        name: 'trim',
        args: [DataType.text],
        returns: DataType.text,
        implementation: (x) => x.trim(),
    });

    dbmem.public.registerFunction({
        name: 'to_char',
        args: [DataType.timestamp, DataType.text],
        returns: DataType.text,
        implementation: (x, y) => {
            return moment.tz(x, 'America/Bogota').format(y);
        },
    });
};

/*const configurarInterceptores = (dbmem: IMemoryDb) => {
    dbmem.public.interceptQueries((sql: string) => {
        if (
            sql.includes(
                `select string_agg(distinct cca.correo_electronico, ',') as "correos" from acuerdo.acuerdos_comerciales a`,
            )
        ) {
            return [{ correos: ['julianc@coordinadora.com', 'nsatara@coordinadora.com'] }];
        }
        return null;
    });
};
*/
