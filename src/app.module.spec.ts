import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonsModule } from './pokemons/pokemons.module';
import { AppModule } from './app.module';

describe('AppModule', () => {
  let appController: AppController;
  let appService: AppService;
  let pokemonsModule: PokemonsModule;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
    pokemonsModule = app.get<PokemonsModule>(PokemonsModule);
  });

  it('should be defined with default values', () => {
    expect(appService).toBeDefined();
    expect(appController).toBeDefined();
    expect(pokemonsModule).toBeDefined();
  });
});
