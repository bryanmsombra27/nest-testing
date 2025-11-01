import { validate } from 'class-validator';
import { UpdatePokemonDto } from './update-pokemon.dto';
import { error } from 'console';

describe('update-pokemon.dto', () => {
  it('should be valid with correct data', async () => {
    const dto = new UpdatePokemonDto();
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should  hp must be positive number', async () => {
    const dto = new UpdatePokemonDto();
    dto.hp = -10;
    const errors = await validate(dto);

    const hpError = errors.find((error) => error.property == 'hp');
    const constrains = hpError?.constraints;

    expect(hpError).toBeDefined();
    expect(constrains).toEqual({ min: 'hp must not be less than 0' });
  });
});
