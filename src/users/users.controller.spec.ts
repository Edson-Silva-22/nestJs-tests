import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  
  //Um mock é um objeto ou função simulada que imita o comportamento de um objeto ou função real em um ambiente de teste. Aqui no caso simula o UsersService com todos os seus metodos
  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{provide: UsersService, useValue: mockUsersService}],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  beforeEach(() => {
    // Reseta todos os mocks para que os testes sejam independentes
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('teste de criação de usuário', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Alex',
      email: 'alex@gmail.com',
      password: 'alex123',
      age: 25
    }

    await usersController.create(createUserDto);

    //vericando ser o método create foi chamado apenas uma vez
    expect(mockUsersService.create).toHaveBeenCalledTimes(1);

    //verificando se o método create foi chamado com o dado correto
    expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);

  })  
});
