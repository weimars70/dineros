import dotenv from 'dotenv';
dotenv.config();
import { IMain, IDatabase } from 'pg-promise';
import pgPromise from 'pg-promise';
import { NODE_ENV } from '@util';
import { IConnectionParameters, IDataBase, IEnvironments } from '../models';
import { CLOUD_CONNECTION_PARAMETERS, CM_CONNECTION_PARAMETERS } from './Config';

const getConnectionParameters = (db: string): IConnectionParameters => {
    const DATABASES: IEnvironments<IConnectionParameters> = {
        development: {},
        testing: {},
        production: {},
    };
    const DATABASE = DATABASES[NODE_ENV] || DATABASES.development;
    const CONEXION: IDataBase<IConnectionParameters> = {
        public: { ...CLOUD_CONNECTION_PARAMETERS, ...DATABASE },
    };
    return CONEXION[db];
};

const getCMConexion = (db: string): IConnectionParameters => {
    const DATABASES: IEnvironments<IConnectionParameters> = {
        development: {},
        testing: {},
        production: {},
    };
    const DATABASE = DATABASES[NODE_ENV] || DATABASES.development;
    const CONEXION: IDataBase<IConnectionParameters> = {
        public: { ...CM_CONNECTION_PARAMETERS, ...DATABASE },
    };
    return CONEXION[db];
};

export const pgp: IMain = pgPromise({ schema: 'public' });
pgp.pg.types.setTypeParser(1114, (str) => str);
pgp.pg.types.setTypeParser(1082, (str) => str);
export const db = pgp(getConnectionParameters('public')) as IDatabase<IMain>;
export const cmDB = pgp(getCMConexion('public')) as IDatabase<IMain>;
