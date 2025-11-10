import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../src/app.module';
import { Pokemon } from '../../../src/pokemons/entities/pokemon.entity';
import { response } from 'express';

describe('Pokemons (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  it('/pokemons (POST) - With no Body', async () => {
    const response = await request(app.getHttpServer()).post('/pokemons');

    const messageArrayBodyErrors = response.body.message ?? [];

    expect(response.statusCode).toBe(400);
    expect(messageArrayBodyErrors).toContain('name must be a string');
    expect(messageArrayBodyErrors).toContain('name should not be empty');
    expect(messageArrayBodyErrors).toContain('type should not be empty');
    expect(messageArrayBodyErrors).toContain('type must be a string');
  });
  it('/pokemons (POST) - With no Body 2', async () => {
    const response = await request(app.getHttpServer()).post('/pokemons');
    const messages = [
      'name must be a string',
      'name should not be empty',
      'type should not be empty',
      'type must be a string',
    ];

    const messageArrayBodyErrors: string[] = response.body.message ?? [];

    expect(response.statusCode).toBe(400);
    expect(messageArrayBodyErrors.length).toBe(messages.length);
    expect(messageArrayBodyErrors).toEqual(expect.arrayContaining(messages));
  });
  it('/pokemons (POST) - With valid Body', async () => {
    const response = await request(app.getHttpServer()).post('/pokemons').send({
      name: 'pikachu',
      type: 'Electric',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      name: 'pikachu',
      type: 'Electric',
      hp: 0,
      sprites: [],
      id: expect.any(Number),
    });
  });

  it('/pokemons (GET) - Should return paginated list of pokemons', async () => {
    const response = await request(app.getHttpServer()).get('/pokemons').query({
      limit: 5,
      page: 1,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(20);

    (response.body as Pokemon[]).forEach((pokemon) => {
      expect(pokemon).toHaveProperty('id');
      expect(pokemon).toHaveProperty('name');
      expect(pokemon).toHaveProperty('hp');
      expect(pokemon).toHaveProperty('type');
      expect(pokemon).toHaveProperty('sprites');
    });
  });

  it('/pokemons/:id (GET) - Should return a pokemon by ID', async () => {
    const id = 1;
    const response = await request(app.getHttpServer()).get(`/pokemons/${id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: 'bulbasaur',
      type: 'grass',
      hp: 45,
      sprites: [
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
      ],
    });
  });
  it('/pokemons/:id (GET) - Should not return a pokemon if ID does not exists', async () => {
    const id = 1_000_000;
    const response = await request(app.getHttpServer()).get(`/pokemons/${id}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Pokemon not found');
  });

  it('/pokemons/:id (PATCH) - Should update a pokemon', async () => {
    const id = 1;
    const updatePokemon = {
      name: 'bolbrt',
      type: 'electrico alv',
    };

    const pokemonResponse = await request(app.getHttpServer()).get(
      `/pokemons/${id}`,
    );
    const bulbasaur = pokemonResponse.body as Pokemon;

    const response = await request(app.getHttpServer())
      .patch(`/pokemons/${id}`)
      .send(updatePokemon);

    const updatedPokemon = response.body as Pokemon;

    expect(response.statusCode).toBe(200);
    expect(bulbasaur.hp).toBe(updatedPokemon.hp);
    expect(bulbasaur.id).toBe(updatedPokemon.id);
    expect(bulbasaur.sprites).toStrictEqual(updatedPokemon.sprites);
    expect(updatedPokemon.name).toBe(updatePokemon.name);
    expect(updatedPokemon.type).toBe(updatePokemon.type);
    // expect(bulbasaur).toEqual(updatePokemon );
  });
  it('/pokemons/:id (PATCH) - Should throw an error if pokemon id does not exists', async () => {
    const updatePokemon: Pokemon = {
      hp: 23,
      id: 1000_000,
      name: 'bolbrt',
      sprites: [],
      type: 'electrico alv',
    };
    const response = await request(app.getHttpServer())
      .patch(`/pokemons/${updatePokemon.id}`)
      .send(updatePokemon);

    expect(response.statusCode).toBe(400);
  });

  it('/pokemons/:id (DELETE) - should remove a pokemon', async () => {
    const id = 1;

    const response = await request(app.getHttpServer()).delete(
      `/pokemons/${id}`,
    );

    expect(response.statusCode).toBe(200);
  });
  it('/pokemons/:id (DELETE) - should  return a not found message if a pokemon was deleted already', async () => {
    const id = 1_000_000;
    const response = await request(app.getHttpServer()).delete(
      `/pokemons/${id}`,
    );

    expect(response.statusCode).toBe(404);
  });
});
