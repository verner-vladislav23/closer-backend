/**
 * HINT: ни в коем случае в боевой среде не использовать origin: '*'
 * Нужно прописать конкретный домен
 */
export default {
    origin: '*',
    methods: 'GET,PUT,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, x-auth-token',
  }