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

  it(`should return an existing document`, (done) => {
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

  it(`should return a list of existing documents of a where query`, (done) => {
    request(server)
      .get(`/cats?name=${createDto.name}&breed=${createDto.breed}`)
      .expect(200)
      .end((err, { body }) => {
        expect(body).toHaveLength(1);

        const cat = body[0];
        expect(cat.id).toEqual(catId);
        expect(cat.name).toEqual(createDto.name);
        expect(cat.age).toEqual(createDto.age);
        expect(cat.breed).toEqual(createDto.breed);
        expect(cat.createTime).toBeDefined();
        expect(cat.readTime).toBeDefined();

        done();
      });
  });

  it(`should return a list of existing documents paginated`, (done) => {
    request(server)
      .get(`/cats/list?limit=1&orderBy=name&startAt=Rest`)
      .expect(200)
      .end((err, { body }) => {
        expect(body.items).toHaveLength(1);

        const cat = body.items[0];
        expect(cat.name).toEqual('Rest');

        done();
      });
  });

  it(`should delete an existing document`, (done) => {
    request(server)
      .delete(`/cats/${catId}`)
      .expect(204)
      .end(() => {
        request(server)
          .get(`/cats/${catId}`)
          .expect(404)
          .end(() => {
            done();
          });
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
