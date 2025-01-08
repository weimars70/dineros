export interface IResponseAliados {
    isError: boolean;
    data: string;
    date: string;
    message: string;
    statusCode: number;
}

export interface IAliadosDataResponseApi {
    nombre: string;
    codigo_terminal: number;
    nombre_terminal: string;
    nro_identificacion: string;
    fecha_creacion: string;
    estado: false;
    dias_legalizacion: number;
    id_aliado: number;
    nombre_tipo_aliado: string;
}
