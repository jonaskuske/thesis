import type { FastifyPluginAsync } from 'fastify'
import { get } from '../utils/cookies'
import { randomUUID } from 'crypto'

const loginBodySchema = {
  type: 'object',
  properties: { r: { type: 'string' } },
  required: [],
}

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: { r?: string } }>(
    '/login',
    { schema: { body: loginBodySchema } },
    async (request, reply) => {
      const userId = get('user_id', request.cookies) ?? randomUUID()
      const encoded = JSON.stringify(userId)

      if (request.headers['accept']?.includes('text/html')) {
        await reply.cookie('user_id', encoded).redirect(303, request.body.r ?? '/')
      } else return reply.cookie('user_id', encoded).send()
    },
  )
}

export default routes
