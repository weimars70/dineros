import { IInfoComplementariaIn } from './IRecaudosIn';

export interface IRecursoIn {
    recaudo_id: string;
    valor_recaudo: number;
    fecha_hora_accion: string;
    recursos: IInfoComplementariaIn[];
}
