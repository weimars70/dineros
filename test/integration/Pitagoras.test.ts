import { application } from '@infrastructure/api/Application';
import { PREFIX } from '@util';
import 'reflect-metadata';
import { DEPENDENCY_CONTAINER, TYPES } from '@configuration';
import { IDatabase, IMain } from 'pg-promise';

describe('PitagorasRouter', () => {
    const payload = {
        idTransaccion: 8592,
    };

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('Insertar pitagoras exitoso', async () => {
        const response = await application.inject({
            method: 'POST',
            url: `${PREFIX}/pitagoras`,
            payload: payload,
        });
        const responseBody = JSON.parse(response.payload);
        console.error('responseBody.code:', responseBody.code);
        //console.log('response:::', response);
        //const result = response.json();
        //console.log('result:::', result);
        expect(response.statusCode).toBe(201);
        //expect(result.isError).toBe(false);
        //expect(result.data).toBe(1);
    });

    it('Insertar pitagoras error validacion sin idTransaccion', async () => {
        const response = await application.inject({
            method: 'POST',
            url: `${PREFIX}/pitagoras`,
            payload: {},
        });

        const result = response.json();

        expect(response.statusCode).toBe(400);
        expect(result.isError).toBe(true);
        expect(result.message).toBe('Los valores de entrada no son correctos.');
        expect(result.cause).toEqual([
            {
                message: 'El campo idTransaccion es obligatorio',
                path: 'idTransaccion',
            },
        ]);
    });

    it('Insertar pitagoras error validacion sin payload', async () => {
        const response = await application.inject({
            method: 'POST',
            url: `${PREFIX}/pitagoras`,
        });

        const result = response.json();

        expect(response.statusCode).toBe(400);
        expect(result.isError).toBe(true);
        expect(result.message).toBe('mensaje indefinido');
    });

    it('Insertar pitagoras error al obtener datos de recaudo', async () => {
        const dbDineros = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(TYPES.Pg);
        const spy = jest.spyOn(dbDineros, 'one');
        spy.mockRejectedValueOnce(new Error('Error al obtener datos de recaudo'));

        const response = await application.inject({
            method: 'POST',
            url: `${PREFIX}/pitagoras`,
            payload: payload,
        });

        const result = response.json();
        expect(response.statusCode).toBe(500);
        expect(result.isError).toBe(true);
        expect(result.message).toBe('Error al obtener datos de recaudo.');
    });

    it('Insertar pitagoras error al insertar en dineros_recibidor', async () => {
        const dbCm = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(TYPES.Cm);
        const spy = jest.spyOn(dbCm, 'tx');
        spy.mockRejectedValueOnce(new Error('Error al insertar en dineros_recibidor'));

        const response = await application.inject({
            method: 'POST',
            url: `${PREFIX}/pitagoras`,
            payload: payload,
        });

        const result = response.json();
        expect(response.statusCode).toBe(500);
        expect(result.isError).toBe(true);
        expect(result.message).toBe('Error al obtener datos de recaudo.');
    });
});
