import { application } from '@infrastructure/api/Application';
import { PREFIX } from '@util';
import 'reflect-metadata';

describe('RecaudosGuardar', () => {
    const payload = {
        recaudo_id: 'vmashcovu',
        terminal: 12,
        valor_recaudo: 200,
        medio_pago: 1,
        fecha_hora_accion: '2023-10-12 12:12:12',
        tipo_recaudo: 22,
        origen_recaudo: 2,
        recaudo_anticipado: false,
        recursos: [
            {
                tipo: 1,
                valor: '1-1',
            },
            {
                tipo: 2,
                valor: '7048',
            },
        ],
    };

    it('Guardar recaudo exitoso', async () => {
        const response = await application.inject({
            method: 'POST',
            url: `${PREFIX}/recaudos`,
            payload: payload,
        });

        const result = response.json();
        expect(response.statusCode).toBe(201);
        expect(result.isError).toBe(false);
        expect(result.data).toBe(1);
    });

    it('Guardar recaudo error', async () => {
        const response = await application.inject({
            method: 'POST',
            url: `${PREFIX}/recaudos`,
            payload: { ...payload, medio_pago: 100 },
        });

        const result = response.json();

        expect(response.statusCode).toBe(500);
        expect(result.isError).toBe(true);
        expect(result.message).toBe(
            'insert or update on table "medios_pagos" violates foreign key constraint on table "fk_recaudos_relations_medios_p"',
        );
    });

    it('Guardar recaudo error validacion 1', async () => {
        const response = await application.inject({
            method: 'POST',
            url: `${PREFIX}/recaudos`,
            payload: { ...payload, recaudo_id: undefined },
        });

        const result = response.json();

        expect(response.statusCode).toBe(400);
        expect(result.isError).toBe(true);
        expect(result.message).toBe('Los valores de entrada no son correctos.');
        expect(result.cause).toEqual([
            {
                message: 'El campo recaudo_id es obligatorio',
                path: 'recaudo_id',
            },
        ]);
    });

    it('Guardar recaudo error validacion 2', async () => {
        const response = await application.inject({
            method: 'POST',
            url: `${PREFIX}/recaudos`,
        });

        const result = response.json();

        expect(response.statusCode).toBe(400);
        expect(result.isError).toBe(true);
        expect(result.message).toBe('mensaje indefinido');
    });
});
