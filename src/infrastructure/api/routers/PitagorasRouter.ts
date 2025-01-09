import { PitagorasAppService } from '@application/services/PitagorasAppService';
import { DEPENDENCY_CONTAINER } from '@configuration';
import { FastifyRequest, FastifyReply } from 'fastify';
import { validateData } from '../util';
import { IpitagorasTransaccion } from '@application/data';
import { PitagorasJoiSchema } from '../schemas';

export const insertPitagoras = async (req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply | void> => {
    const pitagorasService = DEPENDENCY_CONTAINER.get(PitagorasAppService);
    //id_transaccion
    const data = validateData<IpitagorasTransaccion>(PitagorasJoiSchema, req.body);
    const response = await pitagorasService.insertPitagoras(data.idTransaccion);
    return reply.status(201).send({ ...response, id: req.id });
};
