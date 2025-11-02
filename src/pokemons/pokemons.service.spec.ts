import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsService } from './pokemons.service';
import { Pokemon } from './entities/pokemon.entity';

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

  it('should create a pokemon', () => {
    const result = service.create({ name: 'kaso', type: 'kaso' });

    expect(result).toBe('This action adds a new pokemon');
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

  it("Should return 404 error if pokemon doesn't exists", () => {});
});
