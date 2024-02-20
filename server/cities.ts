import type { FastifyPluginAsync } from 'fastify'
import cities from 'zip-to-city/germany.json'

type IQuerystring = { search?: string; include?: string[]; limit?: number }

const citiesQuerystringSchema = {
  type: 'object',
  properties: {
    search: { type: 'string' },
    limit: { type: 'number', multipleOf: 1 },
    include: { type: 'array', uniqueItems: true, items: { type: 'string' } },
  },
}

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.addSchema({
    $id: 'city',
    type: 'object',
    properties: Object.fromEntries(
      Object.keys(cities[0]).map((prop) => [prop, { type: 'string' }]),
    ),
  })

  fastify.addSchema({ $id: 'cities', type: 'array', items: { $ref: 'city' } })

  fastify.get<{ Querystring: IQuerystring; Reply: typeof cities }>(
    '/cities',
    { schema: { querystring: citiesQuerystringSchema, response: { 200: { $ref: 'cities' } } } },
    async (request, reply) => {
      if (request.query.limit === 0) return reply.send([])

      let cityList = cities

      if (request.query.include) {
        const includedIds = new Set(request.query.include)
        cityList = cityList.filter(({ id }) => includedIds.has(id))
      }

      if (request.query.search?.trim()) {
        const search = request.query.search?.trim().toLowerCase()
        cityList = cityList.filter(
          ({ city, zip }) => city.toLowerCase().startsWith(search) || zip.startsWith(search),
        )
      }

      if (request.query.limit) {
        cityList = cityList.slice(0, request.query.limit)
      }

      return reply.send(cityList)
    },
  )
}

export default routes
