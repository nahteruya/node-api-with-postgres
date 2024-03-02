/* import { createServer } from 'node:http';

const server = createServer((request, response) => {
  response.write('hello world!')
  return response.end()
})

server.listen(3000) */

import { fastify } from 'fastify';
//import { DatabaseMemory } from './database-memory.js';
import { DatabasePostgres } from './database-postgres.js';

const server = fastify()

//const database = new DatabaseMemory()

const database = new DatabasePostgres()

// POST http:localhost/3000/videos => criar vídeos

server.post('/videos', async (request, reply) => {
  // request body
  const { title, description, duration } = request.body

  await database.create({
    title,
    description,
    duration
  })

  return reply.status(201).send()
})

// GET http:localhost/3000/videos => buscar informações sobre um ou mais vídeos

server.get('/videos', async (request) => {
  const search = request.query.search
  const videos = await database.list(search)

  return videos
})

// PUT http:localhost/3000/videos/:id => atualizar informações sobre um vídeo específico

server.put('/videos/:id', async (request, reply) => {
  const { title, description, duration } = request.body
  const videoId = request.params.id

  await database.update(videoId, {
    title,
    description,
    duration
  })

  return reply.status(204).send()
})

// DELETE http:localhost/3000/videos/:id => deletar um vídeo específico

server.delete('/videos/:id', async (request, reply) => {
  const videoId = request.params.id

  await database.delete(videoId)

  reply.status(204).send()

})

server.listen({
  host: "0.0.0.0",
  port: process.env.PORT ?? 3000,
})