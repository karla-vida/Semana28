import { CityRepository } from './../city.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { CityService } from '../services/city.service';
import { TestStatic } from 'src/utils/test';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { throwError } from 'rxjs';

describe('CityService', () => {
  let cityService: CityService;
  let cityRepository: CityRepository;

  const mockCityRepository = {
    getById: jest.fn(),
    updateCity: jest.fn(),
    deleteCity: jest.fn(),
    findById: jest.fn(),
    createCity: jest.fn(),
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        { provide: CityRepository, useValue: mockCityRepository },
      ],
    }).compile();
    cityService = module.get<CityService>(CityService);
    cityRepository = module.get<CityRepository>(CityRepository);
  });
  beforeEach(() => {
    mockCityRepository.getById.mockReset();
  });
  it('deveria estar definido', () => {
    expect(cityService).toBeDefined();
  });

  describe('createCity', () => {
    it('deveria criar o objeto city', async () => {
      const city = TestStatic.createCityDto();
      mockCityRepository.createCity.mockReturnValue(null);
      const createCity = await cityService.createCity(city);
      expect(createCity).toBe(undefined);
    });

    it('deveria dar erro  ao criar o objeto city', async () => {
      const city = TestStatic.createCityDto();

      mockCityRepository.createCity.mockRejectedValue(
        throwError(() => new BadRequestException('cityNotCreated')),
      );

      await cityService.createCity(null).catch((error: Error) => {
        expect(error).toMatchObject({
          message: 'cityNotCreated',
        });
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });
  });

  describe('findById', () => {
    it('deveria retornar o objeto city', async () => {
      const city = TestStatic.cityData();
      mockCityRepository.getById.mockReturnValue(city);
      const foundCity = await cityService.findById(city.id);
      expect(foundCity).toMatchObject({ id: city.id });
    });

    it('deveria retornar uma exceção devido ao valor da cidade enviada', async () => {
      mockCityRepository.getById.mockReturnValue(null);
      const id = 1;
      expect(cityService.findById(id)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('updateCity', () => {
    it('deveria atualizar a cidade com sucesso', async () => {
      const city = TestStatic.cityData();
      const cityDto = TestStatic.cityDto();
      mockCityRepository.getById.mockReturnValue(city.id);
      mockCityRepository.updateCity.mockReturnValue({
        ...city,
      });

      const updateCity = await cityService.updateCity(city.id, cityDto);
      expect(updateCity).toMatchObject(city);
    });

    it('deveria retornar uma exceção devido a não encontrar a cidade para atualizar', async () => {
      const city = TestStatic.cityData();
      const dto = TestStatic.cityDto();
      mockCityRepository.getById.mockReturnValue(null);
      const id = 1;
      await cityService.updateCity(id, dto).catch((error: Error) => {
        expect(error).toMatchObject({
          message: 'cityNotFound',
        });
        expect(error).toBeInstanceOf(NotFoundException);
      });
    });
    it('deveria retornar uma exceção devido ao valor da cidade para atualizar', async () => {
      const city = TestStatic.cityData();
      const dto = TestStatic.cityDto();
      mockCityRepository.getById.mockReturnValue(city);
      const id = 1;
      await cityService.updateCity(id, dto).catch((error: Error) => {
        expect(error).toMatchObject({
          message: 'cityNotUpdate',
        });
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });
  });
  describe('deleteCity', () => {
    it('deveria deletar a cidade com sucesso', async () => {
      const city = TestStatic.cityData();
      mockCityRepository.getById.mockReturnValue(city.id);
      mockCityRepository.deleteCity.mockReturnValue(true);

      const valor = await cityService.deleteCity(city.id);

      expect(valor).toBe('Cidade deletada com sucesso');
    });
    it('deveria retornar uma exceção devido a não encontrar a cidade para deletar', async () => {
      const city = TestStatic.cityData();
      mockCityRepository.getById.mockReturnValue(null);
      const id = 1;
      await cityService.deleteCity(id).catch((error: Error) => {
        expect(error).toMatchObject({
          message: 'cityNotFound',
        });
        expect(error).toBeInstanceOf(NotFoundException);
      });
    });
    it('deveria retornar uma exceção devido a um problema ao deletar a cidade', async () => {
      const city = TestStatic.cityData();

      mockCityRepository.getById.mockReturnValue(city);
      const id = 1;
      await cityService.deleteCity(id).catch((error: Error) => {
        expect(error).toMatchObject({
          message: 'CityNotDelete',
        });
        expect(error).toBeInstanceOf(NotFoundException);
      });
    });
  });
});
