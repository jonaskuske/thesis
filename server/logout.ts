import type { FastifyPluginAsync } from 'fastify'

const logoutBodySchema = {
  type: 'object',
  properties: { r: { type: 'string' } },
  required: [],
}

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: { r?: string } }>(
    '/logout',
    { schema: { body: logoutBodySchema } },
    async (request, reply) => {
      if (request.headers['accept']?.includes('text/html')) {
        await reply.clearCookie('user_id').redirect(303, request.body.r ?? '/')
      } else return reply.clearCookie('user_id').send()
    },
  )
}

export default routes
