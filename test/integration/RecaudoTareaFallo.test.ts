import MockFirebase from 'mock-cloud-firestore';
import { FirestoreMockDataTareaRecaudo } from '../mocks/data/';
import { DEPENDENCY_CONTAINER, TYPES } from '@configuration';
import { Firestore } from '@google-cloud/firestore';
import { mockApiAxios } from '../jest.setup';
import { PREFIX } from '@util';
import { application } from '@infrastructure/api/Application';
import { DBMemRepositoryTestFactory } from '../mocks/factories';

describe('Crear Tarea Recaudo', () => {
    const MENSAJE_ERROR = 'El Equipo 100-100 no existe';
    it('Crear Tarea con Fallo - Status 200', async () => {
        // Arrange
        const mockfirebase = new MockFirebase(FirestoreMockDataTareaRecaudo);
        const firestore = mockfirebase.firestore();
        DEPENDENCY_CONTAINER.rebind<Firestore>(TYPES.Firestore).toConstantValue(firestore);
        const recaudo_temporal = await firestore.collection('recaudo_temporal_guias').get();
        const query = `SELECT * FROM novedades.novedades WHERE id = 1`;
        const repositoryTestFactory = new DBMemRepositoryTestFactory();
        const repository = repositoryTestFactory.create(TYPES.Pg);
        const resultadoAntes = await repository.executeQuery(query);
        //Respuesta Llamado a API Tarea Recaudo - Transacciones
        mockApiAxios.mockReturnValueOnce(
            Promise.resolve({
                status: 400,
                data: {
                    isError: true,
                    message: MENSAJE_ERROR,
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

        const resultadoDespues = await repository.executeQuery(query);
        const resultado = JSON.parse(response.body);
        console.log('resultado', resultado);
        // Assert
        expect(response.statusCode).toBe(200);
        expect(resultado.isError).toBe(false);
        expect(resultado.data).toBe(false);
        //Verifica que en la tabla novedades.novedades haya quedado un registro
        expect(resultadoAntes.length).toBe(0);
        expect(resultadoDespues.length).toBe(1);
    });
});
