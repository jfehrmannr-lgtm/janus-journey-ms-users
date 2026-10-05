import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import type { User } from '../src/users/types/user.types.js';

describe('Users API (e2e)', () => {
  let app: INestApplication;
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongo.getUri();
    process.env.MONGODB_DATABASE_NAME = 'janus_journey_test';
    process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS = '5000';
    process.env.PORT = '4001';

    const { AppModule } = await import('../src/app.module.js');
    const { setupSwagger } = await import('../src/config/swagger.config.js');

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
        whitelist: true,
      }),
    );
    setupSwagger(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
    await mongo.stop();
  });

  it('creates, reads, updates, filters, and deletes a User', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'user@example.com', config: { username: 'janus-user' } })
      .expect(201);

    expect(createResponse.body).toMatchObject({
      config: { username: 'janus-user' },
      email: 'user@example.com',
      isVerified: false,
    });

    const createdUser = createResponse.body as unknown as User;
    const id = createdUser.id;

    await request(app.getHttpServer())
      .get(`/users/${id}`)
      .expect(200)
      .expect({
        ...createdUser,
        config: { avatarUrl: null, username: 'janus-user' },
      });

    await request(app.getHttpServer())
      .get('/users?username=janus-user&page=1&limit=10')
      .expect(200)
      .expect((response) => expect(response.body).toHaveLength(1));

    const updateResponse = await request(app.getHttpServer())
      .patch(`/users/${id}`)
      .send({ config: { username: 'updated-user' } })
      .expect(200);

    const updatedUser = updateResponse.body as unknown as User;
    expect(updatedUser.config.username).toBe('updated-user');

    await request(app.getHttpServer()).delete(`/users/${id}`).expect(204);
    await request(app.getHttpServer()).get(`/users/${id}`).expect(404);
  });

  it('validates User input and exposes OpenAPI documentation', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'invalid' })
      .expect(400);
    await request(app.getHttpServer()).get('/docs-json').expect(200);
  });
});
