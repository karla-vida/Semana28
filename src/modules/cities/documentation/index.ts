const cityDocumentation = {
  ApiOperation: {
    getById: {
      summary: 'city/:id',
      description:
        'Este endpoint recebe como param o id e retorna os dados da cidade.',
    },
    createCity: {
      summary: 'city/create',
      description:
        'Este endpoint recebe como body o name e language para salvar um registro de dados.',
    },
    updateCity: {
      summary: 'city/update/:id',
      description:
        'Este endpoint recebe como body o name e language e o path como id para atualizar um registro de dados.',
    },
    deleteById: {
      summary: 'city/:id',
      description: 'Este endpoint recebe como param o id e exclui o registro',
    },
    getByFilter: {
      summary: 'city/getByFilter',
      description:
        'Este endpoint retorna uma listagem completa das cidades disponíveis, também podendo utilizar filtros para melhorar o retorno de dados',
    },
  },
  ApiProperty: {
    CreateCityDtoName: { name: 'name', example: 'Florianópolis' },
    CreateCityDtoLanguage: { name: 'language', example: 'Português' },
    FilterCityDtoName: { name: 'name', required: false, example: 'Curitiba' },
    FilterCityDtoLanguage: {
      name: 'language',
      required: false,
      example: 'Português',
    },
    FilterCityDtoId: {
      name: 'id',
      required: false,
      example: 1,
    },
    FilterCityDtoCreatedAt: {
      name: 'createdAt',
      required: false,
      examples: { asc: { value: 'asc' }, desc: { value: 'desc' } },
    },
    FilterCityDtoUpdatedAt: {
      name: 'updatedAt',
      required: false,
      examples: { asc: { value: 'asc' }, desc: { value: 'desc' } },
    },
  },
};

export { cityDocumentation };
