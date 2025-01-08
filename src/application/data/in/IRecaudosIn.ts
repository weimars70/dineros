export interface IRecaudosIn {
    recaudo_id: string;
    terminal: number;
    valor_recaudo: number;
    medio_pago: number;
    fecha_hora_accion: string;
    tipo_recaudo: number;
    origen_recaudo: number;
    recaudo_anticipado: boolean;
    recursos: IInfoComplementariaIn[];
}

export interface IInfoComplementariaIn {
    valor: string;
    tipo: number;
    detalle: string;
}
