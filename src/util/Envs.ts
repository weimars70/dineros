export const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'local';

export const GCP_PROJECT = process.env.GCP_PROJECT ?? 'cm-dineros-dev';

export const PREFIX = `/${process.env.DOMAIN}/${process.env.SERVICE_NAME}`;

export const HOST = process.env.HOST || 'localhost';

export const TRANSACCIONES_URL =
    process.env.TRANSACCIONES_URL ?? 'https://apiv2-dev.coordinadora.com/dineros/cm-dineros-transacciones/';
