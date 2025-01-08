import JoiImport from 'joi';
import DateExtension from '@joi/date';
const Joi = JoiImport.extend(DateExtension) as typeof JoiImport;
import { messages } from './Messages';
import { IRecaudosConsulta } from '@application/data/in/IRecaudosConsulta';

export const ConsultaRCESchema = Joi.object<IRecaudosConsulta>({
    codigo_remision: Joi.string().required().messages(messages('codigo_remision')),
});
