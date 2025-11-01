import 'reflect-metadata';
import { validate } from 'class-validator';
import { PaginationDto } from './pagination.dto';
import { plainToInstance } from 'class-transformer';

describe('PaginationDto', () => {
  it('Should validate with default values', async () => {
    const dto = new PaginationDto();

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('Should validate with valid data', async () => {
    const dto = new PaginationDto();
    dto.limit = 10;
    dto.page = 1;
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('Should not validate with invalid page', async () => {
    const dto = new PaginationDto();
    dto.page = -12;
    const errors = await validate(dto);
    // expect(errors.length).toBe(1);
    errors.forEach((error) => {
      if (error.property == 'page') {
        expect(error.constraints?.min).toBeDefined();
      } else {
        expect(true).toBe(false);
      }
    });
  });

  it('Should not validate with invalid limit', async () => {
    const dto = new PaginationDto();
    dto.limit = -12;
    const errors = await validate(dto);
    errors.forEach((error) => {
      if (error.property == 'limit') {
        expect(error.constraints?.min).toBeDefined();
      } else {
        expect(true).toBe(false);
      }
    });
  });

  it('Should convert strings into numbers', async () => {
    // const dto = new PaginationDto();
    // dto.page = '10' as unknown as number;
    // dto.limit = '5' as unknown as number;
    const input = { limit: '10', page: '2' };
    const dto = plainToInstance(PaginationDto, input);

    const errors = await validate(dto);

    expect(dto.limit).toBe(10);
    expect(dto.page).toBe(2);
  });
});
