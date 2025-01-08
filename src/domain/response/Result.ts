import { Exception } from '@domain/exceptions';

export interface Response<T> {
    isError: boolean;
    data: T;
    timestamp: Date;
}

export class Result {
    static ok<T>(data?: T): Response<T | null> {
        const fechaActual = new Date();
        return {
            isError: false,
            data: data || null,
            timestamp: new Date(fechaActual.toLocaleString('en-US', { timeZone: 'America/Bogota' })),
        };
    }

    static okBool<T>(data: T): Response<T> {
        const fechaActual = new Date();
        return {
            isError: false,
            data: data,
            timestamp: new Date(fechaActual.toLocaleString('en-US', { timeZone: 'America/Bogota' })),
        };
    }

    static failure<E = Exception>(exception: E): E {
        throw exception;
    }
}
