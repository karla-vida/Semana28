import { StateService } from './../../states/services/state.service';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestStatic } from 'src/utils/test';
import { CityService } from '../services/city.service';
import { CityController } from './city.controller';

describe('CityController', () => {
  let cityController: CityController;

  const mockService = {
    findById: jest.fn(),
    createCity: jest.fn(),
    updateCity: jest.fn(),
    deleteCity: jest.fn(),
  };
  const mockServiceState = {
    getByAll: jest.fn(),
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [
        { provide: CityService, useValue: mockService },
        { provide: StateService, useValue: mockServiceState },
      ],
    }).compile();

    cityController = module.get<CityController>(CityController);
  });

  beforeEach(() => {
    mockService.findById.mockReset();
  });

  it('deveria estar definido', () => {
    expect(cityController).toBeDefined();
  });

  describe('getById', () => {
    it('deveria retornar o resultado da busca e devolver um registro de dados da cidade', async () => {
      const city = TestStatic.cityData();
      mockService.findById.mockReturnValue(city);
      const foundCity = await cityController.getById(city.id);
      expect(foundCity).toMatchObject({ id: city.id });
    });
  });

  describe('updateCity', () => {
    it('deveria retornar o resultado da cidade atualizada', async () => {
      const city = TestStatic.cityData();
      const dto = TestStatic.cityDto();
      mockService.updateCity.mockReturnValue(city);
      const cityUpdate = await cityController.updateCity(city.id, dto);
      expect(cityUpdate).toMatchObject(city);
    });

    it('deveria retornar uma exceção devido ao valor de dev enviado para atualizar', async () => {
      const city = TestStatic.cityData();
      const dto = TestStatic.cityDto();
      mockService.updateCity.mockReturnValue(null);
      const id = 1;
      await cityController.updateCity(id, dto).catch((error: Error) => {
        expect(error).toMatchObject({
          message: 'FieldMustBeNumber',
        });
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });
  });

  describe('deleteById', () => {
    it('deveria deletar por id', async () => {
      const city = TestStatic.cityData();
      mockService.deleteCity.mockReturnValue(city);
      const cityDelete = await cityController.deleteById(city.id);
      expect(cityDelete).toMatchObject(city);
    });

    it('deveria retornar uma exceção devido ao valor de dev enviado', async () => {
      const city = TestStatic.cityData();

      mockService.deleteCity.mockReturnValue(null);
      const id = 1;
      await cityController.deleteById(id).catch((error: Error) => {
        expect(error).toMatchObject({
          message: 'FieldMustBeNumber',
        });
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });
  });
});
