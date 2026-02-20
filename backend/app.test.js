import request from 'supertest';
import app from './app.js';

describe('GET /api/health', () => {
    it('debería responder con estado ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', '✅ Backend activo');
    });
});

describe('GET /api/db-test', () => {
    it('debería responder con conexión a BD', async () => {
        const res = await request(app).get('/api/db-test');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', '✅ BD conectada');
    });
});