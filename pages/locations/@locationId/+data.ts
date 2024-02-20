import type { PageContextServer } from 'vike/types'

export type Data = Awaited<ReturnType<typeof data>>

export async function data(ctx: PageContextServer) {
  return {
    sightings: [
      {
        weather: { temperature: 11, type: 'clear' },
        date: 1708015604918,
      },
      {
        weather: { temperature: 11, type: 'clear' },
        date: 1708015604919,
      },
      {
        weather: { temperature: 11, type: 'clear' },
        date: 1708015604920,
      },
      {
        weather: { temperature: 11, type: 'clear' },
        date: 1708015604921,
      },
    ],
  }
}
