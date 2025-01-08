import { application } from '@infrastructure/api/Application';

describe('Testing App Request', () => {
    it('test de prueba con error 404', async () => {
        //Arrange

        //Act
        const response = await application.inject({
            method: 'POST',
            url: '/route-not-found',
        });

        //Assert
        expect(response.statusCode).toBe(404);
    });
});
