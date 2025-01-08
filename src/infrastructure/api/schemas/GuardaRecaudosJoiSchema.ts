import JoiImport from 'joi';
import DateExtension from '@joi/date';
const Joi = JoiImport.extend(DateExtension) as typeof JoiImport;
import { messages } from './Messages';
import { IInfoComplementariaIn, IRecaudosIn } from '@application/data';

export const GuardarRecaudosJoiSchema = Joi.object<IRecaudosIn>({
    recaudo_id: Joi.string().required().messages(messages('recaudo_id')),
    terminal: Joi.number().required().messages(messages('terminal')),
    valor_recaudo: Joi.number().required().messages(messages('valor_recaudo')),
    medio_pago: Joi.number().required().messages(messages('medio_pago')),
    fecha_hora_accion: Joi.date()
        .format('YYYY-MM-DD HH:mm:ss')
        .raw()
        .required()
        .messages(messages('fecha_hora_accion')),
    tipo_recaudo: Joi.number().required().messages(messages('tipo_recaudo')),
    origen_recaudo: Joi.number().required().messages(messages('origen_recaudo')),
    recaudo_anticipado: Joi.boolean().required().messages(messages('recaudo_anticipado')),
    recursos: Joi.array()
        .min(1)
        .items(
            Joi.object<IInfoComplementariaIn>({
                valor: Joi.string().required().messages(messages('valor')),
                tipo: Joi.number().required().messages(messages('tipo')),
                detalle: Joi.number().optional().messages(messages('detalle')),
            }),
        ),
});
