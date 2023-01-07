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
    server = await app.listen(5325);
    await app.init();
  });

  it(`should return created document`, async () => {
    const result = await request(server).post('/cats').send(createDto);

    expect(result.status).toBe(201);

    const { body } = result;

    expect(body.name).toEqual(createDto.name);
    expect(body.age).toEqual(createDto.age);
    expect(body.breed).toEqual(createDto.breed);
    expect(body.createTime).toBeDefined();
    expect(body.updateTime).toBeDefined();
    expect(body.readTime).not.toBeDefined();

    catId = body.id;
  });

  it(`should return an existing document`, async () => {
    const result = await request(server).get(`/cats/${catId}`);

    expect(result.status).toBe(200);

    const { body } = result;

    expect(body.id).toEqual(body.id);
    expect(body.name).toEqual(createDto.name);
    expect(body.age).toEqual(createDto.age);
    expect(body.breed).toEqual(createDto.breed);
    expect(body.createTime).toEqual(body.createTime);
    expect(body.updateTime).toEqual(body.updateTime);
    expect(body.readTime).toBeDefined();
  });

  it(`should return a list of existing documents of a where query`, async () => {
    const result = await request(server).get(
      `/cats?name=${createDto.name}&breed=${createDto.breed}`,
    );

    expect(result.status).toBe(200);

    const { body } = result;

    expect(body).toHaveLength(1);

    const cat = body[0];
    expect(cat.id).toEqual(catId);
    expect(cat.name).toEqual(createDto.name);
    expect(cat.age).toEqual(createDto.age);
    expect(cat.breed).toEqual(createDto.breed);
    expect(cat.createTime).toBeDefined();
    expect(cat.readTime).toBeDefined();
  });

  it(`should return a list of existing documents paginated`, async () => {
    const result = await request(server).get(
      `/cats/list?limit=1&orderBy=name&startAt=Rest`,
    );

    expect(result.status).toBe(200);

    const { body } = result;
    expect(body.items).toHaveLength(1);

    const cat = body.items[0];
    expect(cat.name).toEqual('Nest');
  });

  it(`should update an existing document`, async () => {
    const newCatName = 'Rest';

    const updateResult = await request(server)
      .patch(`/cats/${catId}`)
      .send({ name: newCatName });

    expect(updateResult.status).toEqual(200);

    const updateBody = updateResult.body;
    expect(updateBody).toStrictEqual({
      id: catId,
      name: newCatName,
      updateTime: expect.any(String),
    });

    const getResult = await request(server).get(`/cats/${catId}`);

    expect(getResult.status).toEqual(200);
    const getBody = getResult.body;
    expect(getBody).toStrictEqual({
      id: catId,
      name: newCatName,
      age: createDto.age,
      breed: createDto.breed,
      readTime: expect.any(String),
      createTime: expect.any(String),
      updateTime: updateBody.updateTime,
    });
  });

  it(`should delete an existing document`, async () => {
    const deleteResult = await request(server).delete(`/cats/${catId}`);
    expect(deleteResult.status).toEqual(204);

    const getResult = await request(server).get(`/cats/${catId}`);
    expect(getResult.status).toEqual(404);
  });

  it('should set a new document and update it', async () => {
    const catId = 'meowd';
    const newCatName = 'Rest';

    const createResult = await request(server)
      .put(`/cats/${catId}`)
      .send(createDto);

    expect(createResult.status).toBe(201);

    const createBody = createResult.body;
    expect(createBody.name).toEqual(createDto.name);
    expect(createBody.age).toEqual(createDto.age);
    expect(createBody.breed).toEqual(createDto.breed);
    expect(createBody.createTime).toBeDefined();
    expect(createBody.updateTime).toBeDefined();
    expect(createBody.readTime).not.toBeDefined();

    const updateResult = await request(server)
      .put(`/cats/${catId}`)
      .send({ ...createDto, name: newCatName });

    expect(updateResult.status).toBe(200);

    const updateBody = updateResult.body;
    expect(updateBody).toStrictEqual({
      id: catId,
      name: newCatName,
      age: createDto.age,
      breed: createDto.breed,
      createTime: expect.any(String),
      updateTime: expect.any(String),
    });

    expect(updateBody.createTime).not.toEqual(createBody.createTime);
    expect(updateBody.updateTime).not.toEqual(createBody.createTime);
  });

  afterEach(async () => {
    await app.close();
    await server.close();
  });
});
