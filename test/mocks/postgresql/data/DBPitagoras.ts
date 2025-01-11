import { IMemoryDb } from 'pg-mem';

export const insertarDinerosRecibidor = (bdmen: IMemoryDb): void => {
    bdmen.public.none(`INSERT INTO public.dineros_recibidor
        (fecha, terminal, equipo, recibidor, forma_de_pago, numero_aprobacion, valor, usuario)
        VALUES
        ('2024-01-01', 1, '1234-1', 7048, 1, '12345', 1000000, 'test'),
        ('2024-01-02', 2, '3024-1', 7049, 1, '67890', 2000000, 'test2');`);
};
