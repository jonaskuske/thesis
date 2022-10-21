import type { FastifyPluginAsync } from 'fastify'

const locationsBodySchema = {
  type: 'object',
  properties: { id: { type: 'string' } },
  required: ['id'],
}

const routes: FastifyPluginAsync<{ isDev: boolean; isProd: boolean }> = async (fastify) => {
  fastify.post<{ Body: { id: string } }>(
    '/locations',
    { schema: { body: locationsBodySchema } },
    async (request, reply) => {
      const cookies = JSON.parse(request.cookies.locations || '[]') as string[]

      const ids = new Set(cookies)
      ids.add(request.body.id)

      await reply
        .cookie('locations', JSON.stringify([...ids]))
        .redirect(303, '/')
        .send()
    },
  )
}

export default routes
