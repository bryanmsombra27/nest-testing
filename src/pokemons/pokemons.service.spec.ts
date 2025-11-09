import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsService } from './pokemons.service';
import { Pokemon } from './entities/pokemon.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

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

  it('should throw an error if pokemon exists', async () => {
    const data = { name: 'pikachu', type: 'Electric' };
    await service.create(data);

    try {
      await service.create(data);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe(
        `Pokemon with name ${data.name} already exists`,
      );
    }
    // await expect(service.create(data)).rejects.toThrow(BadRequestException);
  });

  it('should create a pokemon', async () => {
    const name = 'kaso';
    const result = await service.create({ name, type: 'kaso' });

    expect(result).toStrictEqual({
      hp: 0,
      id: expect.any(Number),
      name: 'kaso',
      sprites: [],
      type: 'kaso',
    });
  });

  it('should return a pokemon if exists', async () => {
    const pokemon = await service.findOne(4);

    const response: Pokemon = {
      id: expect.any(Number),
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

  it('Should return a pokemon from cache', async () => {
    const id = 1;
    const cacheSpy = jest.spyOn(service.pokemonCached, 'get');
    await service.findOne(id);
    await service.findOne(id);

    expect(cacheSpy).toHaveBeenCalledTimes(1);
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
  it('should return pokemons from cache', async () => {
    const limit = 10;
    const page = 1;
    const cachekey = `${limit}-${page}`;
    const fetchSpy = jest.spyOn(global, 'fetch');
    const cacheSpy = jest.spyOn(service.paginatedPokemonCached, 'get');

    await service.findAll({
      limit,
      page,
    });
    await service.findAll({
      limit,
      page,
    });

    expect(cacheSpy).toHaveBeenCalledTimes(1);
    expect(cacheSpy).toHaveBeenCalledWith(cachekey);
    expect(fetchSpy).toHaveBeenCalledTimes(21);
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

  it('Should update a pokemon', async () => {
    const id = 1;
    const updateDto: UpdatePokemonDto = {
      name: 'koso 2',
    };

    const updatedPokemon = await service.update(id, updateDto);

    expect(updatedPokemon).toEqual({
      id: 1,
      name: updateDto.name,
      type: 'grass',
      hp: 45,
      sprites: [
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
      ],
    });
  });
  it('Should not update a pokemon if doesnt exists', async () => {
    const id = 1_000_000;
    const updateDto: UpdatePokemonDto = {
      name: 'koso 2',
    };

    try {
      await service.update(id, updateDto);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Pokemon not found');
      // expect(updatedPokemon).rejects.toThrow(NotFoundException);
    }
  });
  it('Should remove pokemon from cache', async () => {
    const id = 1;
    await service.findOne(id);

    await service.remove(id);

    expect(service.pokemonCached.get(id)).toBeUndefined();
  });
});
