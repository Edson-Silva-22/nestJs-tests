import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import User from '../schemas/users';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { getModelToken } from '@nestjs/mongoose';

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: Model<typeof User>;

  const mockUserModel = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {provide: getModelToken('users'), useValue: mockUserModel},
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userModel = module.get<Model<typeof User>>(getModelToken('users'));
  });

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('método create: criação de um usuário', () => {

    it('Não Deve salvar dois usuários com o mesmo nome.', async () => {
      const createUserDto1: CreateUserDto = {
        name: 'Alex',
        email: 'alex@gmail.com',
        password: 'alex123',
        age: 25
      }

      const createUserDto2: CreateUserDto = {
        name: 'Alex',
        email: 'alex@gmail.com',
        password: 'alex123',
        age: 25
      }

      //Chamando o método create passando o primeiro usuário
      await usersService.create(createUserDto1)

      //Verificando se o método find do mongoose foi chamado apenas uma vez dentro do método create do usersService
      expect(mockUserModel.find).toHaveBeenCalledTimes(1)
      //Verificando se o método find do mongoose foi chamado com o parâmetro certo.
      expect(mockUserModel.find).toHaveBeenCalledWith({name: createUserDto1.name})

      //Verificando se o método create do mongoose foi chamado apenas uma vez dentro do método create do usersService
      expect(mockUserModel.create).toHaveBeenCalledTimes(1)
      //Verificando se o método create do mongoose foi chamado com o parâmetro certo.
      expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto1)


      // //Chamando o método create passando o segundo usuário
      // await usersService.create(createUserDto2)

      // //Verificando se o método find do mongoose foi chamado apenas uma vez dentro do método create do usersService
      // expect(mockUserModel.find).toHaveBeenCalledTimes(2)
      // //Verificando se o método find do mongoose foi chamado com o parâmetro certo.
      // expect(mockUserModel.find).toHaveBeenCalledWith({name: createUserDto2.name})
      
      // //Verificando se o método create do mongoose foi chamado apenas uma vez dentro do método create do usersService
      // expect(mockUserModel.create).toHaveBeenCalledTimes(1)
      // //Verificando se o método create do mongoose foi chamado com o parâmetro certo.
      // expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto2)
    })

    it('Não deve salvar dois usuários com mesmo email', async () => {
      const createUserDto1: CreateUserDto = {
        name: 'Alex',
        email: 'alex@gmail.com',
        password: 'alex123',
        age: 25
      }

      const createUserDto2: CreateUserDto = {
        name: 'Ana',
        email: 'alex@gmail.com',
        password: 'ana123',
        age: 28
      }

      //Chamando o método create passando o primeiro usuário
      await usersService.create(createUserDto1)

      //Verificando se o método find do mongoose foi chamado apenas uma vez dentro do método create do usersService
      expect(mockUserModel.find).toHaveBeenCalledTimes(1)
      //Verificando se o método find do mongoose foi chamado com o parâmetro certo.
      expect(mockUserModel.find).toHaveBeenCalledWith({name: createUserDto1.name})

      //Verificando se o método create do mongoose foi chamado apenas uma vez dentro do método create do usersService
      expect(mockUserModel.create).toHaveBeenCalledTimes(1)
      //Verificando se o método create do mongoose foi chamado com o parâmetro certo.
      expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto1)

      // //Verificando se o método save do mongoose foi chamado apenas uma vez dentro do método create do usersService
      // expect(mockUserModel.save).toHaveBeenCalledTimes(1)
      // //Verificando se o método save do mongoose foi sem parâmetros.
      // expect(mockUserModel.save).toHaveBeenCalledWith()


      //Chamando o método create passando o segundo usuário
      await usersService.create(createUserDto2)

      //Verificando se o método find do mongoose foi chamado apenas uma vez dentro do método create do usersService
      expect(mockUserModel.find).toHaveBeenCalledTimes(1)
      //Verificando se o método find do mongoose foi chamado com o parâmetro certo.
      expect(mockUserModel.find).toHaveBeenCalledWith({name: createUserDto2.name})
      
      //Verificando se o método create do mongoose foi chamado apenas uma vez dentro do método create do usersService
      expect(mockUserModel.create).toHaveBeenCalledTimes(1)
      //Verificando se o método create do mongoose foi chamado com o parâmetro certo.
      expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto2)
    })

    it('Criando um novo usuário', async() => {
      const createUserDto: CreateUserDto = {
        name: 'Maria',
        email: 'maria@gmail.com',
        password: 'alex123',
        age: 25
      }

      await usersService.create(createUserDto)

      //Verificando se o método find do mongoose foi chamado apenas uma vez dentro do método create do usersService
      expect(mockUserModel.find).toHaveBeenCalledTimes(1)
      //Verificando se o método find do mongoose foi chamado com o parâmetro certo.
      expect(mockUserModel.find).toHaveBeenCalledWith({name: createUserDto.name})

      //Verificando se o método create do mongoose foi chamado apenas uma vez dentro do método create do usersService
      expect(mockUserModel.create).toHaveBeenCalledTimes(1)
      //Verificando se o método create do mongoose foi chamado com o parâmetro certo.
      expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto)
    })
  })
});
