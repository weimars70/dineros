import { INovedades } from '@infrastructure/api/interfaces/INovedades';

export interface NovedadesRepository {
    insertar(data: INovedades): Promise<boolean>;
}
