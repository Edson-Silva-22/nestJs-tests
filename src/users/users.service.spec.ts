import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import User from 'src/schemas/users';
import { CreateUserDto } from './dto/create-user.dto';

const mockUserModel = {
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
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
    it('Deve cadastrar um novo usuário.', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Alex',
        email: 'alex@gmail.com',
        password: 'alex123',
        age: 25,
      }

      //Quando você utiliza mockResolvedValue, a função mockada vai retornar uma Promise que é resolvida com o valor que você especificar.
      mockUserModel.find.mockResolvedValue([]);
      mockUserModel.create.mockResolvedValue(createUserDto);

      const result = await service.create(createUserDto);

      //Verificando se o método create do mongoose esta sendo chamado apenas uma vez
      expect(mockUserModel.create).toHaveBeenCalledTimes(1)
      //Verificando se o método create do mongoose foi chamado com o parâmetro certo.
      expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto)

      expect(mockUserModel.find).toHaveBeenCalledTimes(1)
      expect(mockUserModel.find).toHaveBeenCalledWith({name: createUserDto.name})

      expect(result).toEqual({
        result: createUserDto,
        status: 200,
      });

    });
  })
});
