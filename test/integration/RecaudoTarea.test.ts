import MockFirebase from 'mock-cloud-firestore';
import { FirestoreMockDataTareaRecaudo } from '../mocks/data/';
import { DEPENDENCY_CONTAINER, TYPES } from '@configuration';
import { Firestore } from '@google-cloud/firestore';
import { mockApiAxios } from '../jest.setup';
import { PREFIX } from '@util';
import { application } from '@infrastructure/api/Application';

describe('Crear Tarea Recaudo', () => {
    it('Crear Tarea - Status 200', async () => {
        // Arrange
        const mockfirebase = new MockFirebase(FirestoreMockDataTareaRecaudo);
        const firestore = mockfirebase.firestore();
        DEPENDENCY_CONTAINER.rebind<Firestore>(TYPES.Firestore).toConstantValue(firestore);
        const recaudo_temporal = await firestore.collection('recaudo_temporal_guias').get();
        //Respuesta Llamado a API Tarea Recaudo - Transacciones
        mockApiAxios.mockReturnValueOnce(
            Promise.resolve({
                status: 201,
                data: {
                    isError: false,
                    message: 'Recaudo registrado con éxito',
                    timestamp: '2030-09-13T17:32:28Z',
                },
            }),
        );

        //Respuesta Llamado a API Tarea Recaudo - Transacciones
        mockApiAxios.mockReturnValueOnce(
            Promise.resolve({
                status: 201,
                data: {
                    isError: false,
                    message: 'Recaudo registrado con éxito',
                    timestamp: '2030-09-13T17:32:28Z',
                },
            }),
        );
        //Verificar que antes, los registros estén en estado pendiente
        expect(recaudo_temporal.docs[0].data().estado).toBe('pendiente');
        expect(recaudo_temporal.docs[1].data().estado).toBe('pendiente');

        // Act

        const response = await application.inject({
            method: 'GET',
            url: `${PREFIX}/recaudos/tarea`,
        });

        const resultado = JSON.parse(response.body);

        // Assert
        expect(response.statusCode).toBe(200);
        expect(resultado.isError).toBe(false);
        expect(resultado.data).toBe(true);
    });

    it('Tarea Sin Recaudos pendientes - Status 200', async () => {
        // Arrange
        const mockfirebase = new MockFirebase(FirestoreMockDataTareaRecaudo);
        const firestore = mockfirebase.firestore();
        DEPENDENCY_CONTAINER.rebind<Firestore>(TYPES.Firestore).toConstantValue(firestore);
        /* No se debe llamar a ningún API Externo ya que no existen recaudos pendientes.
           deebido a que fueron procesados exitosamente en el test anterior.
        */

        // Act
        const response = await application.inject({
            method: 'GET',
            url: `${PREFIX}/recaudos/tarea`,
        });

        const resultado = JSON.parse(response.body);
        // Assert
        expect(response.statusCode).toBe(200);
        expect(resultado.isError).toBe(false);
        expect(resultado.data).toBe(true);
    });
});
