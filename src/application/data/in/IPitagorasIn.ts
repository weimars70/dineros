export interface IPitagorasIn {
    fecha: Date;
    terminal: number;
    equipo: string;
    recibidor: number;
    forma_de_pago: number;
    numero_aprobacion: string;
    valor: number;
    usuario: string;
}

export interface IpitagorasTransaccion {
    idTransaccion: number;
}
