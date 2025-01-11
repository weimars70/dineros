import { IMemoryDb } from 'pg-mem';

export const TABLAS_PITAGORAS = {
    generarTablaDinerosRecibidor: (db: IMemoryDb) => {
        db.public.none(`CREATE TABLE public.dineros_recibidor (
            id serial NOT NULL,
            fecha date NOT NULL,
            terminal numeric NOT NULL,
            equipo varchar(100) NOT NULL,
            recibidor numeric NOT NULL,
            forma_de_pago numeric NOT NULL,
            numero_aprobacion varchar(100) NOT NULL,
            valor numeric NOT NULL,
            usuario varchar(100) NOT NULL,
            CONSTRAINT pk_dineros_recibidor PRIMARY KEY (id)
        );`);
    },
};
