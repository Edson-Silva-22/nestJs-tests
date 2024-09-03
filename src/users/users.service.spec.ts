import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import User from 'src/schemas/users';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const mockUserModel = {
  find: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let model: typeof User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('users'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<typeof User>(getModelToken('users'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Método Create', () => {
    const createUserDto: CreateUserDto = {
      name: 'Alex',
      email: 'alex@gmail.com',
      password: 'alex123',
      age: 25,
    }

    it('Deve cadastrar um novo usuário.', async () => {

      //Quando você utiliza mockResolvedValue, a função mockada vai retornar uma Promise que é resolvida com o valor que você especificar.
      mockUserModel.find.mockResolvedValue([]);
      mockUserModel.create.mockResolvedValue(createUserDto);

      const result = await service.create(createUserDto);
      
      //Verificando se o método find do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledTimes(1)
      //Verificando se o método find do mongoose foi chamado com o parâmetro certo dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledWith({name: createUserDto.name})

      //Verificando se o método create do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.create).toHaveBeenCalledTimes(1)
      //Verificando se o método create do mongoose foi chamado com o parâmetro certo dentro do service.
      expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto)

      expect(result).toEqual({
        result: createUserDto,
        status: 200,
      });

    });

    it('Deve retornar um erro caso já exista um usuário com o mesmo nome.', async () => {

      //Quando você utiliza mockResolvedValue, a função mockada vai retornar uma Promise que é resolvida com o valor que você especificar.
      mockUserModel.find.mockResolvedValue([createUserDto]);

      const result = await service.create(createUserDto);

      //Verificando se o método find do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledTimes(1)
      //Verificando se o método find do mongoose foi chamado com o parâmetro certo dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledWith({name: createUserDto.name})

      expect(result).toEqual({
        message: 'Nome ou email já esta em uso por outro usuário.',
        status: 400,
      });
    })

    it('Deve retornar um erro caso ocorra algum erro ao salvar o usuário.', async () => {

      //Quando você utiliza mockRejectedValue, a função mockada vai retornar uma Promise que é rejeitada com o valor que você especificar.
      mockUserModel.find.mockResolvedValue([]);
      mockUserModel.create.mockRejectedValue(new Error('Erro ao salvar o usuário.'));

      const result = await service.create(createUserDto);

      //Verificando se o método create do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.create).toHaveBeenCalledTimes(1)
      //Verificando se o método create do mongoose foi chamado com o parâmetro certo dentro do service.
      expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto)

      expect(result).toEqual({
        message: 'Erro ao salvar o usuário.',
        status: 500
      })
    })
  })

  describe('Método FindAll', () => {
    const createUserDto: CreateUserDto = {
      name: 'Alex',
      email: 'alex@gmail.com',
      password: 'alex123',
      age: 25,
    }

    it('Deve retornar todos os usuários.', async () => {

      //Quando você utiliza mockResolvedValue, a função mockada vai retornar uma Promise que é resolvida com o valor que você especificar.
      mockUserModel.find.mockResolvedValue([createUserDto]);

      const result = await service.findAll();

      //Verificando se o método find do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledTimes(1)
      //Verificando se o método find do mongoose foi chamado com o parâmetro certo dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledWith()

      expect(result).toEqual({
        result: [createUserDto],
        status: 200,
      });
    })

    it('Deve retornar um erro caso ocorra algum erro ao buscar os usuários.', async () => {
      //Quando você utiliza mockRejectedValue, a função mockada vai retornar uma Promise que é rejeitada com o valor que você especificar.
      mockUserModel.find.mockRejectedValue(new Error('Erro ao buscar os usuários.'));

      const result = await service.findAll();

      //Verificando se o método find do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledTimes(1)
      //Verificando se o método find do mongoose foi chamado com o parâmetro certo dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledWith()

      expect(result).toEqual({
        message: 'Erro ao buscar os usuários.',
        status: 500
      })
    })

  })

  describe('Método FindOne', () => {
    const createUserDto: CreateUserDto = {
      name: 'Alex',
      email: 'alex@gmail.com',
      password: 'alex123',
      age: 25,
    }

    it('Deve retornar um usuário específico.', async () => {

      //Quando você utiliza mockResolvedValue, a função mockada vai retornar uma Promise que é resolvida com o valor que você especificar.
      mockUserModel.find.mockResolvedValue([createUserDto]);

      const result = await service.findOne('66b4c495c9629d4c37adbde7');

      //Verificando se o método findOne do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledTimes(1)
      //Verificando se o método findOne do mongoose foi chamado com o parâmetro certo dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledWith({_id: '66b4c495c9629d4c37adbde7'})

      expect(result).toEqual({
        result: createUserDto,
        status: 200,
      });
    })

    it('Deve retornar um erro caso o usuário não seja encontrado.', async () => {
      //Quando você utiliza mockResolvedValue, a função mockada vai retornar uma Promise que é resolvida com o valor que você especificar.
      mockUserModel.find.mockResolvedValue([]);

      const result = await service.findOne('66b4c495c9629d4c37adbde7');

      //Verificando se o método findOne do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledTimes(1)
      //Verificando se o método findOne do mongoose foi chamado com o parâmetro certo dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledWith({_id: '66b4c495c9629d4c37adbde7'})

      expect(result).toEqual({
        message: 'Usuário não foi encontrado.',
        status: 400
      })
    })

    it('Deve retornar um erro caso ocorra algum erro ao buscar o usuário.', async () => {
      //Quando você utiliza mockRejectedValue, a função mockada vai retornar uma Promise que é rejeitada com o valor que você especificar.
      mockUserModel.find.mockRejectedValue(new Error('Erro ao buscar o usuário.'));

      const result = await service.findOne('66b4c495c9629d4c37adbde7');

      //Verificando se o método findOne do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledTimes(1)
      //Verificando se o método findOne do mongoose foi chamado com o parâmetro certo dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledWith({_id: '66b4c495c9629d4c37adbde7'})

      expect(result).toEqual({
        message: 'Erro ao buscar o usuário.',
        status: 500
      })
    })
  })

  describe('Método Update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Alexatualizado',
      email: 'alexatualizado@gmail.com',
      password: 'alexatualizado123',
      age: 26,
    }

    it('Deve atualizar um usuário específico.', async () => {
      //Quando você utiliza mockResolvedValue, a função mockada vai retornar uma Promise que é resolvida com o valor que você especificar.
      mockUserModel.find.mockResolvedValue([updateUserDto])
      mockUserModel.updateOne.mockResolvedValue(updateUserDto);

      const result = await service.update('66b4c495c9629d4c37adbde7', updateUserDto);

      //Verificando se o método find do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledTimes(1);
      //Verificando se o método find do mongoose foi chamado com o parâmetro certo dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledWith({_id: '66b4c495c9629d4c37adbde7'});

      //Verificando se o método updateOne do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.updateOne).toHaveBeenCalledTimes(1)
      //Verificando se o método updateOne do mongoose foi chamado com o parâmetro certo dentro
      expect(mockUserModel.updateOne).toHaveBeenCalledWith({_id: '66b4c495c9629d4c37adbde7'}, updateUserDto)

      expect(result).toEqual({
        message: 'Usuário atualizado com sucesso.',
        status: 200,
      });
    })

    it('Deve retornar um erro caso o usuário não seja encontrado.', async () => {
      //Quando você utiliza mockResolvedValue, a função mockada vai retornar uma Promise que é resolvida com o valor que você especificar.
      mockUserModel.find.mockResolvedValue([]);

      const result = await service.update('66b4c495c9629d4c37adbde7', updateUserDto);

      //Verificando se o método find do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledTimes(1);
      //Verificando se o método find do mongoose foi chamado com o parâmetro certo dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledWith({_id: '66b4c495c9629d4c37adbde7'});

      expect(result).toEqual({
        message: 'Usuário não foi encontrado.',
        status: 400
      })
    })

    it('Deve retornar um erro caso ocorra algum erro ao atualizar o usuário.', async () => {
      //Quando você utiliza mockRejectedValue, a função mockada vai retornar uma Promise que é rejeitada com o valor que você especificar.
      mockUserModel.find.mockResolvedValue([updateUserDto])
      mockUserModel.updateOne.mockRejectedValue(new Error('Erro ao atualizar o usuário.'));

      const result = await service.update('66b4c495c9629d4c37adbde7', updateUserDto);

      //Verificando se o método find do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledTimes(1);
      //Verificando se o método find do mongoose foi chamado com o parâmetro certo dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledWith({_id: '66b4c495c9629d4c37adbde7'});

      //Verificando se o método updateOne do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.updateOne).toHaveBeenCalledTimes(1)
      //Verificando se o método updateOne do mongoose foi chamado com o parâmetro certo dentro
      expect(mockUserModel.updateOne).toHaveBeenCalledWith({_id: '66b4c495c9629d4c37adbde7'}, updateUserDto)

      expect(result).toEqual({
        message: 'Erro ao atualizar o usuário.',
        status: 500
      })
    })
  })

  describe('Método Remove', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Alexatualizado',
      email: 'alexatualizado@gmail.com',
      password: 'alexatualizado123',
      age: 26,
    }

    it('Deve remover um usuário específico.', async () => {
      //Quando você utiliza mockResolvedValue, a função mockada vai retornar uma Promise que é resolvida com o valor que você especificar.
      mockUserModel.find.mockResolvedValue([updateUserDto])
      mockUserModel.deleteOne.mockResolvedValue('usuário deletado');

      const result = await service.remove('66b4c495c9629d4c37adbde7');

      //Verificando se o método find do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledTimes(1);
      //Verificando se o método find do mongoose foi chamado com o parâmetro certo dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledWith({_id: '66b4c495c9629d4c37adbde7'});

      //Verificando se o método deleteOne do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.deleteOne).toHaveBeenCalledTimes(1)
      //Verificando se o método deleteOne do mongoose foi chamado com o parâmetro certo dentro
      expect(mockUserModel.deleteOne).toHaveBeenCalledWith({_id: '66b4c495c9629d4c37adbde7'})

      expect(result).toEqual({
        message: 'Usuário excluído com sucesso.',
        status: 200,
      })
    })

    it('Deve retornar um erro caso o usuário não seja encontrado.', async () => {
      //Quando você utiliza mockResolvedValue, a função mockada vai retornar uma Promise que é resolvida com o valor que você especificar.
      mockUserModel.find.mockResolvedValue([]);

      const result = await service.remove('66b4c495c9629d4c37adbde7');

      //Verificando se o método find do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledTimes(1);
      //Verificando se o método find do mongoose foi chamado com o parâmetro certo dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledWith({_id: '66b4c495c9629d4c37adbde7'});

      expect(result).toEqual({
        message: 'Usuário não foi encontrado.',
        status: 400
      })
    })

    it('Deve retornar um erro caso ocorra algum erro ao remover o usuário.', async () => {
      //Quando você utiliza mockRejectedValue, a função mockada vai retornar uma Promise que é rejeitada com o valor que você especificar.
      mockUserModel.find.mockResolvedValue([updateUserDto])
      mockUserModel.deleteOne.mockRejectedValue(new Error('Erro ao remover o usuário.'));

      const result = await service.remove('66b4c495c9629d4c37adbde7');

      //Verificando se o método find do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledTimes(1);
      //Verificando se o método find do mongoose foi chamado com o parâmetro certo dentro do service.
      expect(mockUserModel.find).toHaveBeenCalledWith({_id: '66b4c495c9629d4c37adbde7'});

      //Verificando se o método deleteOne do mongoose esta sendo chamado apenas uma vez dentro do service.
      expect(mockUserModel.deleteOne).toHaveBeenCalledTimes(1)
      //Verificando se o método deleteOne do mongoose foi chamado com o parâmetro certo dentro
      expect(mockUserModel.deleteOne).toHaveBeenCalledWith({_id: '66b4c495c9629d4c37adbde7'})

      expect(result).toEqual({
        message: 'Erro ao excluir o usuário.',
        status: 500
      });
    })
  })
});
