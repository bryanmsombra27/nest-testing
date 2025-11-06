import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsService } from './pokemons.service';
import { Pokemon } from './entities/pokemon.entity';
import { NotFoundException } from '@nestjs/common';

describe('PokemonsService', () => {
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonsService],
    }).compile();

    service = module.get<PokemonsService>(PokemonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a pokemon', async () => {
    const name = 'kaso';
    const result = await service.create({ name, type: 'kaso' });

    expect(result).toBe(`This action adds a new pokemon ${name}`);
  });

  it('should return a pokemon if exists', async () => {
    const pokemon = await service.findOne(4);

    const response: Pokemon = {
      id: 4,
      name: 'charmander',
      type: 'fire',
      hp: 39,
      sprites: [
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png',
      ],
    };

    expect(pokemon).toEqual(response);
  });

  it("Should return 404 error if pokemon doesn't exists", async () => {
    const id = 400_000;

    await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
  });

  it('should find all pokemons and cache them', async () => {
    const limit = 10;
    const page = 1;

    const pokemons = await service.findAll({
      limit,
      page,
    });
    const cachekey = `${limit}-${page}`;

    expect(pokemons).toBeInstanceOf(Array);
    // expect(pokemons.length).toBe(10);
    // expect(service.paginatedPokemonCached.get(cachekey)).toEqual(pokemons);
    expect(service.paginatedPokemonCached.has(cachekey)).toBeTruthy();
    expect(service.paginatedPokemonCached.get(cachekey)).toBe(pokemons);
  });

  it('Should check properties of the pokemon', async () => {
    const pokemon = await service.findOne(4);

    expect(pokemon).toHaveProperty('id');
    expect(pokemon).toHaveProperty('name');
    expect(pokemon).toEqual(
      expect.objectContaining({
        id: 4,
        hp: expect.any(Number),
      }),
    );
  });
});
