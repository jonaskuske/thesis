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
        await reply.clearCookie('user_id').redirect(request.body.r ?? '/', 303)
      } else return reply.clearCookie('user_id').send()
    },
  )
}

export default routes
