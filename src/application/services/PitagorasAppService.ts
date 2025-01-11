import { injectable } from 'inversify';
import { DEPENDENCY_CONTAINER } from '@configuration';
import { PitagorasDao } from '@infrastructure/repositories';

@injectable()
export class PitagorasAppService {
    private readonly pitagorasDao = DEPENDENCY_CONTAINER.get(PitagorasDao);

    async insertPitagoras(idTransaccion: number): Promise<{ message: string; code: number; error: boolean }> {
        //consultar la data;
        const data = await this.pitagorasDao.getDataRecaudo(idTransaccion);
        console.error('###DATA###', data);
        const id = await this.pitagorasDao.insertPitagoras(data, idTransaccion);

        if (id > 0) {
            return {
                message: 'Registro procesado exitosamente',
                code: 201,
                error: false,
            };
        }
        return {
            message: 'Error interno del servidor.',
            code: 500,
            error: true,
        };
    }
}
