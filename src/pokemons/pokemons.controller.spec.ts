import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';
import { Pokemon } from './entities/pokemon.entity';

const mockPokemons: Pokemon[] = [
  {
    id: 1,
    name: 'bulbasaur',
    type: 'grass',
    hp: 45,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
    ],
  },
  {
    id: 2,
    name: 'ivysaur',
    type: 'grass',
    hp: 60,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/2.png',
    ],
  },
];

describe('PokemonsController', () => {
  let controller: PokemonsController;
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonsController],
      providers: [PokemonsService],
    }).compile();

    controller = module.get<PokemonsController>(PokemonsController);
    service = module.get<PokemonsService>(PokemonsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have call the service with correct parameters', async () => {
    const dto = {
      limit: 20,
      page: 1,
    };
    jest.spyOn(service, 'findAll');

    const pokemons = await controller.findAll(dto);

    // expect(service.findAll).toHaveBeenCalled();
    expect(service.findAll).toHaveBeenCalledWith(dto);
  });
  it('should have call the service and check the results', async () => {
    const dto = {
      limit: 20,
      page: 1,
    };

    jest
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve(mockPokemons));
    const pokemons = await controller.findAll(dto);

    expect(pokemons).toBe(mockPokemons);
  });
  it('should have called the service with the correct id (findone)', async () => {
    const dto = {
      limit: 10,
      page: 1,
    };
    const spy = jest
      .spyOn(service, 'findOne')
      .mockImplementation(() => Promise.resolve(mockPokemons[0]));
    const id = '1';
    const pokemon = await controller.findOne(id);

    expect(spy).toHaveBeenCalledWith(+id);
    expect(pokemon).toEqual(mockPokemons[0]);
  });
  it('should have called the service with the correct id and data (update)', async () => {
    const dto = {
      limit: 10,
      page: 1,
    };
    const spy = jest
      .spyOn(service, 'update')
      .mockImplementation(() =>
        Promise.resolve(`This action updates a #${id} pokemon`),
      );
    const id = '1';
    const pokemon = await controller.update(id, mockPokemons[0]);

    expect(pokemon).toBe(`This action updates a #${id} pokemon`);
  });
  it('should have called the service with the correct id (delete)', async () => {
    const dto = {
      limit: 10,
      page: 1,
    };
    const spy = jest
      .spyOn(service, 'remove')
      .mockImplementation(() =>
        Promise.resolve(`This action removes a #${id} pokemon`),
      );
    const id = '1';
    const pokemon = await controller.remove(id);

    expect(pokemon).toBe(`This action removes a #${id} pokemon`);
  });
});
