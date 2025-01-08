import { FastifyInstance } from 'fastify';
import { ConsultarRCESchema } from '../swagger/schemas/ConsultarRCESchema';
import { guardarRecaudo, healtCheck, consultaRecaudoEfectivo, procesarRecaudo } from './RecaudosRouter';

export const initRoutes = async (application: FastifyInstance): Promise<void> => {
    application.post(`/recaudos`, guardarRecaudo);
    application.get(`/recaudos/tarea`, procesarRecaudo);
    application.get(`/recaudos/rce-efectivo-guia/:codigo_remision`, ConsultarRCESchema, consultaRecaudoEfectivo);
    application.get(`/healt-check`, healtCheck);
    application.get(`/bolsillo`, healtCheck);
};
