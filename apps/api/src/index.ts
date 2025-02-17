import { Hono } from 'hono'
import { DEFAULT_API_PORT } from './constants';

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Bono!')
});

app.get('/test', (c) => {
  return c.json({
    status: 200,
    payload: {
      name: 'Jhon',
      surname: 'Travolta'
    }
  })
});

app.get('/process', (c) => {
  return c.json({
    status: 200,
    payload: process.env
  })
});

export default {
  port: process.env.API_PORT ?? DEFAULT_API_PORT,
  fetch: app.fetch
}
