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
      .send({
        authLogins: [{ authLogin: 'platform-user', provider: 'platform' }],
        config: { username: 'janus-user' },
        email: 'user@example.com',
        id: 'auth-user-1',
      })
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
      .get('/users?username=janus-user&page=1&size=10')
      .expect(200)
      .expect((response) => {
        const body = response.body as {
          items: unknown[];
          totalRecords: number;
        };
        expect(body.items).toHaveLength(1);
        expect(body.totalRecords).toBe(1);
      });

    const updateResponse = await request(app.getHttpServer())
      .patch(`/users/${id}`)
      .send({
        config: {
          avatarUrl: 'https://example.com/avatar.png',
          username: 'updated-user',
        },
      })
      .expect(200);

    const updatedUser = updateResponse.body as unknown as User;
    expect(updatedUser.config.username).toBe('updated-user');
    expect(updatedUser.config.avatarUrl).toBe('https://example.com/avatar.png');

    await request(app.getHttpServer())
      .patch(`/users/${id}`)
      .send({
        authLogins: [],
        config: { username: 'not-applied' },
        createdAt: new Date().toISOString(),
        email: 'changed@example.com',
        id: 'changed-id',
        isVerified: true,
        metadata: {},
        updatedAt: new Date().toISOString(),
        userId: 'changed-user-id',
      })
      .expect(400);

    await request(app.getHttpServer())
      .get(`/users/${id}`)
      .expect(200)
      .expect((response) => {
        const persistedUser = response.body as unknown as User;
        expect(persistedUser.email).toBe('user@example.com');
        expect(persistedUser.id).toBe(id);
        expect(persistedUser.isVerified).toBe(false);
        expect(persistedUser.userId).toBe(createdUser.userId);
      });

    await request(app.getHttpServer()).delete(`/users/${id}`).expect(204);
    await request(app.getHttpServer()).get(`/users/${id}`).expect(404);
  });

  it('validates User input and exposes OpenAPI documentation', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'invalid' })
      .expect(400);
    await request(app.getHttpServer())
      .get('/docs-json')
      .expect(200)
      .expect((response) => {
        const document = response.body as {
          paths: {
            '/users'?: {
              get?: {
                parameters?: Array<{
                  name?: string;
                  schema?: {
                    type?: string;
                    minimum?: number;
                    maximum?: number;
                  };
                }>;
              };
            };
          };
        };
        const pageSize = document.paths['/users']?.get?.parameters?.find(
          (parameter) => parameter.name === 'size',
        );

        expect(pageSize).toMatchObject({
          schema: { minimum: 1, type: 'integer' },
        });
        expect(pageSize?.schema?.maximum).toBeUndefined();
      });
  });

  it('accepts every approved authentication provider', async () => {
    for (const provider of ['platform', 'google', 'github', 'microsoft']) {
      await request(app.getHttpServer())
        .post('/users')
        .send({
          authLogins: [{ authLogin: `oauth-${provider}-1`, provider }],
          config: { username: `${provider}-user` },
          email: `${provider}@example.com`,
          id: `auth-${provider}-1`,
        })
        .expect(201);
    }
  });

  it('accepts positive page sizes, normalizes oversized values, and rejects invalid values', async () => {
    for (const pageSize of [1, 50, 200, 201, 2000, 40000]) {
      await request(app.getHttpServer())
        .get(`/users?page=1&size=${pageSize}`)
        .expect(200);
    }

    for (const pageSize of ['0', '-20', '1.5', 'abc', 'Infinity']) {
      await request(app.getHttpServer())
        .get(`/users?page=1&size=${pageSize}`)
        .expect(400);
    }

    for (const isVerified of ['true', 'false']) {
      await request(app.getHttpServer())
        .get(`/users?page=1&size=20&isVerified=${isVerified}`)
        .expect(200);
    }

    await request(app.getHttpServer())
      .get('/users?page=1&size=20&isVerified=invalid')
      .expect(400);
  });
});
