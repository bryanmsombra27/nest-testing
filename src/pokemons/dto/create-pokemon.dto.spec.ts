import { validate } from 'class-validator';
import { CreatePokemonDto } from './create-pokemon.dto';
import { error } from 'console';

describe('create-pokemon.dto', () => {
  it('should be valid with correct data', async () => {
    const dto = new CreatePokemonDto();
    dto.name = 'Pikachu';
    dto.type = 'keso';
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if name is not present', async () => {
    const dto = new CreatePokemonDto();
    dto.type = 'keso';
    const errors = await validate(dto);

    const nameError = errors.find((error) => error.property == 'name');

    expect(nameError).toBeDefined();
  });

  it('should be invalid if type is not present', async () => {
    const dto = new CreatePokemonDto();
    dto.name = 'Pikachu';
    const errors = await validate(dto);

    const typeError = errors.find((error) => error.property == 'type');

    expect(typeError).toBeDefined();
  });
  it('should  hp must be positive number', async () => {
    const dto = new CreatePokemonDto();
    dto.name = 'Pikachu';
    dto.type = 'keso';
    dto.hp = -10;
    const errors = await validate(dto);

    const hpError = errors.find((error) => error.property == 'hp');
    const constrains = hpError?.constraints;

    expect(hpError).toBeDefined();
    expect(constrains).toEqual({ min: 'hp must not be less than 0' });
  });
  it('should  be invalid with non-string sprites', async () => {
    const dto = new CreatePokemonDto();
    dto.name = 'Pikachu';
    dto.type = 'keso';
    dto.sprites = [1, 2, 3, 4, 5, 6] as unknown as string[];

    const errors = await validate(dto);

    const spritesError = errors.find((error) => error.property == 'sprites');
    const constrains = spritesError?.constraints;

    expect(spritesError).toBeDefined();
    expect(constrains).toEqual({
      isString: 'each value in sprites must be a string',
    });
  });
  it('should  bevalid with string sprites', async () => {
    const dto = new CreatePokemonDto();
    dto.name = 'Pikachu';
    dto.type = 'keso';
    dto.sprites = ['21', 'qa1', 'as'];

    const errors = await validate(dto);

    const spritesError = errors.find((error) => error.property == 'sprites');

    expect(spritesError).toBeUndefined();
    expect(errors.length).toBe(0);
  });
});
