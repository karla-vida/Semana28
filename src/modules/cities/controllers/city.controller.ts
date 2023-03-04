import { cityDocumentation } from 'src/modules/cities/documentation';
import { StateService } from '../../states/services/state.service';
import { CityService } from '../services/city.service';
import axios from 'axios';
import { City } from '../interfaces';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CityEntity } from '../entities/city.entity';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UpdateCityDto } from '../dto/update-city.dto';
import { isNumber } from 'class-validator';
const { ApiOperation: doc } = cityDocumentation;

@ApiTags('cities')
@Controller('city')
export class CityController {
  constructor(
    private cityService: CityService,
    private stateService: StateService,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: number): Promise<CityEntity> {
    return await this.cityService.findById(id);
  }

  @Post('createAllCities')
  async createAllCities(): Promise<string> {
    try {
      const { data } = await axios.get(
        'http://servicodados.ibge.gov.br/api/v1/localidades/municipios',
      );
      const states = await this.stateService.getByAll();

      data.forEach((city: City) => {
        const state = states.find(
          ({ initials }) => city.microrregiao.mesorregiao.UF.sigla === initials,
        );

        const newCity = {
          name: city.nome,
          state_id: state.id,
        };

        this.cityService.createCity(newCity);
      });
      return 'Cidades salvas com sucesso';
    } catch (error) {
      console.log(error);
    }
  }

  @ApiOperation(doc.updateCity)
  @Patch('update/:id')
  @UsePipes(new ValidationPipe())
  async updateCity(
    @Param('id') id: number,
    @Body() updateCityDto: UpdateCityDto,
  ): Promise<CityEntity> {
    if (!isNumber(+id)) {
      throw new BadRequestException('FieldMustBeNumber');
    }
    const cityUpdate = await this.cityService.updateCity(id, updateCityDto);
    return cityUpdate;
  }

  @ApiOperation(doc.deleteById)
  @Delete(':id')
  @UsePipes(new ValidationPipe())
  async deleteById(@Param('id') id: number): Promise<string> {
    if (!isNumber(+id)) {
      throw new BadRequestException('FieldMustBeNumber');
    }
    return await this.cityService.deleteCity(id);
  }
}
