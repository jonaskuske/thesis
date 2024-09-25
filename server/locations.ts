import type { FastifyPluginAsync } from 'fastify'
import { get } from '../utils/cookies'

const locationsBodySchema = {
  type: 'object',
  properties: { id: { type: 'string' } },
  required: ['id'],
}

const locationDeleteParamsSchema = {
  type: 'object',
  properties: { locationId: { type: 'string' } },
}

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: { id: string } }>(
    '/locations',
    { schema: { body: locationsBodySchema } },
    async (request, reply) => {
      const cookies = get('location_ids', request.cookies) ?? []

      const ids = new Set(cookies)
      ids.add(request.body.id)

      await reply.cookie('location_ids', JSON.stringify([...ids])).redirect('/', 303)
    },
  )

  fastify.post<{ Params: { locationId: string } }>(
    '/locations/:locationId/delete',
    { schema: { params: locationDeleteParamsSchema } },
    async function (request, reply) {
      const cookies = get('location_ids', request.cookies) ?? []

      const ids = new Set(cookies)
      ids.delete(request.params.locationId)

      await reply.cookie('location_ids', JSON.stringify([...ids])).redirect('/', 303)
    },
  )
}

export default routes
