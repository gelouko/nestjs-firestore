import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Server } from 'http';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Firestore', () => {
  let server: Server;
  let app: INestApplication;

  const createDto = {
    name: 'Nest',
    breed: 'Maine coon',
    age: 5,
  };
  let catId: string;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it(`should return created document`, (done) => {
    request(server)
      .post('/cats')
      .send(createDto)
      .expect(201)
      .end((err, { body }) => {
        expect(body.name).toEqual(createDto.name);
        expect(body.age).toEqual(createDto.age);
        expect(body.breed).toEqual(createDto.breed);
        expect(body.createTime).toBeDefined();
        expect(body.updateTime).toBeDefined();
        expect(body.readTime).not.toBeDefined();

        catId = body.id;

        done();
      });
  });

  it(`should return created document`, (done) => {
    request(server)
      .get(`/cats/${catId}`)
      .expect(200)
      .end((err, { body }) => {
        expect(body.id).toEqual(body.id);
        expect(body.name).toEqual(createDto.name);
        expect(body.age).toEqual(createDto.age);
        expect(body.breed).toEqual(createDto.breed);
        expect(body.createTime).toEqual(body.createTime);
        expect(body.updateTime).toEqual(body.updateTime);
        expect(body.readTime).toBeDefined();

        done();
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
