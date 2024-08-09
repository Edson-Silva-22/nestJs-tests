import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  it('método create: criação de usuários', async () => {
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
  
  it('método findAll: listar todos os usuários', async () => {
    await usersController.findAll()

    //verificando se o método findAll foi chamado apenas uma vez
    expect(mockUsersService.findAll).toHaveBeenCalledTimes(1)

    //verificando se o método findAll não recebeu nenhum argumento
    expect(mockUsersService.findAll).toHaveBeenCalledWith()
  })

  it('método findOne: listar um usuário específico', async () => {
    await usersController.findOne('66a238d0fa6b7f83e1bb3902')

    //verificando se o método findOne foi chamado apenas uma vez
    expect(mockUsersService.findOne).toHaveBeenCalledTimes(1)

    //verificando se o método findOne não recebeu nenhum argumento
    expect(mockUsersService.findOne).toHaveBeenCalledWith('66a238d0fa6b7f83e1bb3902')
  })

  it('método update: atualizar um usuário', async () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Alex',
      email: 'alex@gmail.com',
      password: 'alex123',
      age: 26
    }

    await usersController.update('66a238d0fa6b7f83e1bb3902', updateUserDto)

    //verificando se o método update foi chamado apenas uma vez
    expect(mockUsersService.update).toHaveBeenCalledTimes(1)

    //verificando se o método update recebeu um id e o updateUserDto como parâmetros
    expect(mockUsersService.update).toHaveBeenCalledWith('66a238d0fa6b7f83e1bb3902', updateUserDto)
  })

  it('método remove: deletar um usuário', async () => {
    await usersController.remove('66a238d0fa6b7f83e1bb3902')

    //verificando se o método remove foi chamado apenas uma vez
    expect(mockUsersService.remove).toHaveBeenCalledTimes(1)

    //verificando se o método remove recebeu um id como parâmetro
    expect(mockUsersService.remove).toHaveBeenCalledWith('66a238d0fa6b7f83e1bb3902')
  })
});
