import { Injectable } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { PokemonResponse } from 'src/shared/interfaces/pokemons.interface';
import { Pokemon } from './entities/pokemon.entity';
import { SinglePokemonResponse } from 'src/shared/interfaces/pokemon.interface';

@Injectable()
export class PokemonsService {
  private paginatedPokemonCached = new Map<string, Pokemon[]>();

  create(createPokemonDto: CreatePokemonDto) {
    return 'This action adds a new pokemon';
  }

  async findAll(paginationDto: PaginationDto): Promise<Pokemon[]> {
    const { limit, page } = paginationDto;
    const offset = (+page - 1) * limit;
    const cacheKey = `${limit}-${page}`;

    if (this.paginatedPokemonCached.has(cacheKey)) {
      return this.paginatedPokemonCached.get(cacheKey)!;
    }
    const url = `https://pokeapi.co/api/v2/pokemon?limit${limit}&offset=${offset}`;

    const response = await fetch(url);
    const data = (await response.json()) as PokemonResponse;

    const pokemonPromises = data.results.map((pokemon) => {
      const id = +pokemon.url.split('/').at(-2)!;
      return this.getPokemonInformation(id);
    });

    const pokemons = await Promise.all(pokemonPromises);

    this.paginatedPokemonCached.set(cacheKey, pokemons);

    return pokemons;
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }

  private async getPokemonInformation(id: number): Promise<Pokemon> {
    const respoonse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = (await respoonse.json()) as SinglePokemonResponse;

    return {
      id: data.id,
      name: data.name,
      type: data.types[0].type.name,
      hp: data.stats[0].base_stat,
      sprites: [data.sprites.front_default, data.sprites.back_default],
    };
  }
}
