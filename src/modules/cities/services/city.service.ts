import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from '../dto/create-city.dto';
import { CityRepository } from '../city.repository';
import { CityEntity } from '../entities/city.entity';
import { BadRequestException } from '@nestjs/common';
import { UpdateCityDto } from '../dto/update-city.dto';

@Injectable()
export class CityService {
  constructor(private readonly cityRepository: CityRepository) {}

  async findById(id: number): Promise<CityEntity> {
    const foundCity = await this.cityRepository.getById(id);
    if (!foundCity) {
      throw new NotFoundException('cityNotFound');
    }

    return foundCity;
  }

  async createCity(newCity: CreateCityDto): Promise<void> {
    await this.cityRepository.createCity(newCity);
  }

  async updateCity(
    id: number,
    fieldsCityUpdate: UpdateCityDto,
  ): Promise<CityEntity> {
    const foundCity = await this.cityRepository.getById(id);

    if (!foundCity) {
      throw new NotFoundException('cityNotFound');
    }

    try {
      const cityUpdate = await this.cityRepository.updateCity({
        ...foundCity,
        ...fieldsCityUpdate,
      });

      return cityUpdate;
    } catch (error) {
      throw new BadRequestException('cityNotUpdate');
    }
  }

  async deleteCity(id: number): Promise<string> {
    const foundCity = await this.cityRepository.getById(id);

    if (!foundCity) {
      throw new NotFoundException('cityNotFound');
    }

    const cityDelete = await this.cityRepository.deleteCity(foundCity);

    if (!cityDelete) {
      throw new NotFoundException('CityNotDelete');
    }

    return 'Cidade deletada com sucesso';
  }
}
