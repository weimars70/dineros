import JoiImport from 'joi';
import DateExtension from '@joi/date';
const Joi = JoiImport.extend(DateExtension) as typeof JoiImport;
import { messages } from './Messages';
import { IPitagorasIn } from '@application/data/in/IPitagorasIn';

export const PitagorasJoiSchema = Joi.object<IPitagorasIn>({
    fecha: Joi.date().required().messages(messages('fecha')),
    terminal: Joi.number().required().messages(messages('terminal')),
    equipo: Joi.string().required().messages(messages('equipo')),
    recibidor: Joi.number().required().messages(messages('recibidor')),
    forma_de_pago: Joi.number().required().messages(messages('forma_de_pago')),
    numero_aprobacion: Joi.string().required().messages(messages('numero_aprobacion')),
    valor: Joi.number().required().min(0).messages(messages('valor')),
    usuario: Joi.string().required().messages(messages('usuario')),
});
