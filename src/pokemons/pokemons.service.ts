import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { PokemonResponse } from 'src/shared/interfaces/pokemons.interface';
import { Pokemon } from './entities/pokemon.entity';
import { SinglePokemonResponse } from 'src/shared/interfaces/pokemon.interface';
import { response } from 'express';

@Injectable()
export class PokemonsService {
  paginatedPokemonCached = new Map<string, Pokemon[]>();
  pokemonCached = new Map<number, Pokemon>();

  async create(createPokemonDto: CreatePokemonDto) {
    const pokemon: Pokemon = {
      ...createPokemonDto,
      id: new Date().getTime(),
      hp: createPokemonDto.hp ?? 0,
      sprites: createPokemonDto.sprites ?? [],
    };

    this.pokemonCached.forEach((storedPokemon) => {
      if (pokemon.name === storedPokemon.name) {
        throw new BadRequestException(
          `Pokemon with name ${pokemon.name} already exists`,
        );
      }
    });

    this.pokemonCached.set(pokemon.id, pokemon);

    return pokemon;
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

  async findOne(id: number) {
    if (this.pokemonCached.has(id)) {
      return this.pokemonCached.get(id);
    }

    const pokemon = await this.getPokemonInformation(id);

    if (!pokemon) throw new NotFoundException('pokemon not found');

    this.pokemonCached.set(pokemon.id, pokemon);

    return pokemon;
  }

  async update(id: number, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(id);

    const updatedPokemon = {
      ...pokemon!,
      ...updatePokemonDto,
    };

    this.pokemonCached.set(id, updatedPokemon);

    return Promise.resolve(updatedPokemon);
  }

  async remove(id: number) {
    const pokemon = await this.findOne(id);

    if (this.pokemonCached.has(id)) {
      this.pokemonCached.delete(id);
    }

    return Promise.resolve(`This action removes a #${id} pokemon`);
  }

  private async getPokemonInformation(id: number): Promise<Pokemon> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (response.status === 404) {
      throw new NotFoundException('Pokemon not found');
    }

    const data = (await response.json()) as SinglePokemonResponse;

    return {
      id: data.id,
      name: data.name,
      type: data.types[0].type.name,
      hp: data.stats[0].base_stat,
      sprites: [data.sprites.front_default, data.sprites.back_default],
    };
  }
}
