export const ConsultarRCESchema = {
    schema: {
        description:
            'Endpoint para consultar si una guía con NS/SC RCE, RCE Mismo día o RCE Entregas AM está recaudada.',
        tags: ['RCE'],
        params: {
            type: 'object',
            properties: {
                codigo_remision: { type: 'string', example: '121120124', description: '(Obligatorio)' },
            },
            required: ['codigo_remision'],
        },
        response: {
            '200': {
                description: 'Recaudo encontrado exitosamente',
                type: 'object',
                properties: {
                    isError: { type: 'boolean', example: false },
                    data: { type: 'boolean', example: true },
                    timestamp: { type: 'string', format: 'date-time', example: '2023-03-22T20:55:57.020Z' },
                    id: { type: 'string', example: 'f3e3e3e3-3e3e-3e3e-3e3e-3e3e3e3e3e3e' },
                },
            },
            '400': {
                description: 'Valores de entrada incorrecta',
                type: 'object',
                properties: {
                    isError: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Los valores de entrada no son correctos.' },
                    code: { type: 'string', example: 'BAD_MESSAGE' },
                    cause: { type: 'null', example: 'null' },
                    timestamp: { type: 'string', format: 'date-time', example: '2023-03-22T21:00:00.000Z' },
                    statusCode: { type: 'number', example: '400' },
                    id: { type: 'string', example: 'f3e3e3e3-3e3e-3e3e-3e3e-3e3e3e3e3e3e' },
                },
            },
            '500': {
                description: 'Error de servidor',
                type: 'object',
                properties: {
                    isError: { type: 'boolean', example: true },
                    message: {
                        type: 'string',
                        example: 'Error al consultar codigo droopError: getaddrinfo ENOTFOUND dbcmtest.loc',
                    },
                    code: { type: 'string', example: 'UNKNOWN_ERROR' },
                    cause: { type: 'string', example: 'Default translator error' },
                    timestamp: { type: 'string', format: 'date-time', example: '2023-03-22T20:52:41.413Z' },
                    statusCode: { type: 'number', example: '500' },
                    id: { type: 'string', example: '9085d074fd57bb27361465acffa3f4f6f439af7b' },
                },
            },
        },
    },
};
