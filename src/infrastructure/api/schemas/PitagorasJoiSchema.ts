import JoiImport from 'joi';
import DateExtension from '@joi/date';

const Joi = JoiImport.extend(DateExtension) as typeof JoiImport;
import { messages } from './Messages';
import { IpitagorasTransaccion } from '@application/data';

export const PitagorasJoiSchema = Joi.object<IpitagorasTransaccion>({
    idTransaccion: Joi.number().required().messages(messages('idTransaccion')),
});
