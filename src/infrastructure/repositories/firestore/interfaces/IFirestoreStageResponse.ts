export interface IFirestoreStageResponse {
    recaudo_id: string;
    terminal: number;
    tipo_recurso?: number | null;
    tipo_recurso_responsable?: number | null;
    responsable?: string | null;
    origen_recaudo: number;
    valor_recaudo: number;
    medio_pago: number;
    fecha_hora_accion: string;
    tipo_recaudo: number;
    referencias: IReferencia[];
    tipo_recurso_referencias: number;
    recaudo_anticipado: boolean;
    recursos: IInformacionComplementaria[];
    estado?: string;
    fecha_creacion?: string;
    ultimo_error?: string;
    interno?: boolean;
    aliado?: number;
    estado_bolsillo?: string;
}

export interface IReferencia {
    referencia: string;
    valor: number;
}

interface IInformacionComplementaria {
    valor: string;
    tipo: number;
    detalle?: string;
}
