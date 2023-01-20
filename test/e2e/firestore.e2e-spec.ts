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

    expect(body).toStrictEqual({
      id: expect.any(String),
      name: createDto.name,
      age: createDto.age,
      breed: createDto.breed,
      createTime: expect.any(String),
      updateTime: expect.any(String),
    });

    catId = body.id;
  });

  it(`should return an existing document`, async () => {
    const result = await request(server).get(`/cats/${catId}`);
    expect(result.status).toBe(200);

    const { body } = result;

    expect(body).toStrictEqual({
      id: catId,
      name: createDto.name,
      age: createDto.age,
      breed: createDto.breed,
      createTime: expect.any(String),
      updateTime: expect.any(String),
      readTime: expect.any(String),
    });
  });

  it(`should return a list of existing documents of a where query`, async () => {
    const result = await request(server).get(
      `/cats?name=${createDto.name}&breed=${createDto.breed}`,
    );

    expect(result.status).toBe(200);

    const { body } = result;

    expect(body).toStrictEqual([
      {
        id: catId,
        name: createDto.name,
        age: createDto.age,
        breed: createDto.breed,
        createTime: expect.any(String),
        updateTime: expect.any(String),
        readTime: expect.any(String),
      },
    ]);
  });

  it(`should return a list of existing documents paginated`, async () => {
    const startName = 'Rest';

    const createResult = await request(server)
      .post('/cats')
      .send({ ...createDto, name: 'Rest' });
    expect(createResult.status).toBe(201);

    const catId = createResult.body.id;

    const listResult = await request(server).get(
      `/cats/list?limit=1&orderBy=name&startAt=${startName}`,
    );

    expect(listResult.status).toBe(200);

    const { body } = listResult;
    expect(body).toStrictEqual({
      items: [
        {
          id: catId,
          name: startName,
          age: createDto.age,
          breed: createDto.breed,
          createTime: expect.any(String),
          updateTime: expect.any(String),
          readTime: expect.any(String),
        },
      ],
    });
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

    expect(createBody).toStrictEqual({
      id: catId,
      name: createDto.name,
      age: createDto.age,
      breed: createDto.breed,
      createTime: expect.any(String),
      updateTime: expect.any(String),
    });

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

  it('should inject a transaction to run in a transactional context', async () => {
    const catId = 'meowd';
    const catSurname = 'Art';

    const result = await request(server)
      .patch(`/cats/${catId}/surname`)
      .send({ surname: catSurname });

    expect(result.status).toBe(200);

    expect(result.body).toStrictEqual({
      ...createDto,
      name: 'Rest ' + catSurname,
      id: catId,
      readTime: expect.any(String),
      createTime: expect.any(String),
      updateTime: expect.any(String),
    });
  });

  afterEach(async () => {
    await app.close();
    await server.close();
  });
});
