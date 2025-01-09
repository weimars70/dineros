export const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'local';

export const GCP_PROJECT = process.env.GCP_PROJECT ?? 'cm-dineros-dev';

export const PREFIX = `/${process.env.DOMAIN}/${process.env.SERVICE_NAME}`;

export const HOST = process.env.HOST || 'localhost';

export const TRANSACCIONES_URL =
    process.env.TRANSACCIONES_URL ?? 'https://apiv2-dev.coordinadora.com/dineros/cm-dineros-transacciones/';

// Dineros DB
export const POSTGRES_HOST = process.env.POSTGRES_HOST ?? 'localhost';
export const POSTGRES_USER = process.env.POSTGRES_USER ?? 'postgres';
export const POSTGRES_PASS = process.env.POSTGRES_PASS ?? 'password';
export const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE ?? 'postgres';
export const POSTGRES_PORT = process.env.POSTGRES_PORT ?? 5432;

// CM DB
export const CM_POSTGRES_HOST = process.env.CM_POSTGRES_HOST ?? 'localhost';
export const CM_USER = process.env.CM_USER ?? 'postgres';
export const CM_PASS = process.env.CM_PASS ?? 'password';
export const CM_DATABASE = process.env.CM_DATABASE ?? 'postgres';
export const CM_PORT = process.env.CM_PORT ?? 5432;

