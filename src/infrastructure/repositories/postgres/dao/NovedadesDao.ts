import { DEPENDENCY_CONTAINER, TYPES } from '@configuration';
import { DatabaseError } from '@domain/exceptions';
import { NovedadesRepository } from '@domain/repository/NovedadesRepository';
import { INovedades } from '@infrastructure/api/interfaces/INovedades';
import { injectable } from 'inversify';
import { IDatabase, IMain } from 'pg-promise';

@injectable()
export class NovedadesDao implements NovedadesRepository {
    private readonly db = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(TYPES.Pg);

    public async insertar(data: INovedades): Promise<boolean> {
        try {
            await this.db.none(
                'INSERT INTO novedades.novedades(id_tipo_novedad,detalle,descripcion) VALUES ($1,$2,$3)',
                [data.id_tipo_novedad, data.detalle, data.descripcion],
            );
            return true;
        } catch (error: any) {
            console.error('Error en insertarNovedad', error);
            throw new DatabaseError(error, 'Error en insertarNovedad');
        }
    }
}
