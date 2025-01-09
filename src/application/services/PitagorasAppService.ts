import { injectable } from 'inversify';
import { DEPENDENCY_CONTAINER } from '@configuration';
import { Result, Response } from '@domain/response';
import { PitagorasDao } from '@infrastructure/repositories';

@injectable()
export class PitagorasAppService {
    private readonly pitagorasDao = DEPENDENCY_CONTAINER.get(PitagorasDao);

    async insertPitagoras(idTransaccion: number): Promise<Response<number | null>> {
        //consultar la data;
        const data = await this.pitagorasDao.getDataRecaudo(idTransaccion);
        const id = await this.pitagorasDao.insertPitagoras(data, idTransaccion);
        return Result.ok(id);
    }
}
