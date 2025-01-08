import { RecaudosAppService } from '@application/services';
import { DEPENDENCY_CONTAINER } from '@configuration';
import { FastifyRequest, FastifyReply } from 'fastify';
import { validateData } from '../util';
import { IRecaudosIn } from '@application/data';
import { GuardarRecaudosJoiSchema } from '../schemas/GuardaRecaudosJoiSchema';
import { ConsultaRCESchema } from '../schemas/ConsultarRCESchema';
import { IRecaudosConsulta } from '@application/data/in/IRecaudosConsulta';

export const guardarRecaudo = async (req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply | void> => {
    const recaudosService = DEPENDENCY_CONTAINER.get(RecaudosAppService);
    const data = validateData<IRecaudosIn>(GuardarRecaudosJoiSchema, req.body);
    const response = await recaudosService.guardarRecaudo(data);
    return reply.status(201).send({ ...response, id: req.id });
};

export const healtCheck = async (_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply | void> => {
    return reply.send({ data: 'ok' });
};

export const consultaRecaudoEfectivo = async (
    req: FastifyRequest,
    reply: FastifyReply,
): Promise<FastifyReply | void> => {
    const recaudosService = DEPENDENCY_CONTAINER.get(RecaudosAppService);
    const data = validateData<IRecaudosConsulta>(ConsultaRCESchema, req.params);
    const response = await recaudosService.consultarRecaudoRCE(data);
    return reply.status(200).send({ ...response, id: req.id });
};

export const procesarRecaudo = async (req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply | void> => {
    const recaudosService = DEPENDENCY_CONTAINER.get(RecaudosAppService);
    const response = await recaudosService.procesarRecaudo();
    return reply.status(200).send({ ...response, id: req.id });
};
