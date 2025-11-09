import { Pokemon } from './pokemon.entity';

describe('Pokemon Entity', () => {
  it('Should create a pokemon instance', () => {
    const pokemon = new Pokemon();

    expect(pokemon).toBeInstanceOf(Pokemon);
  });

  it('Should have these properties', () => {
    const pokemon = new Pokemon();
    pokemon.id = 123;
    pokemon.hp = 132;
    pokemon.name = 'keso';
    pokemon.sprites = ['sprite.png', 'sprite2.png'];
    pokemon.type = 'kaso';

    expect(pokemon).toEqual({});
  });
});
