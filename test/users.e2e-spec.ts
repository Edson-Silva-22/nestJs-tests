import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/db-tests'),
        AppModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    connection = moduleFixture.get<Connection>(getConnectionToken())
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach( async () => {
    // Limpa a coleção de usuários antes de cada teste, se necessário
    await connection.collection('users').deleteMany({});
  })

  describe('/users (POST) deve criar um novo usuário', () => {
    const createUserDto: CreateUserDto = {
      name: 'Alex',
      email: 'alex@gmail.com',
      password: 'alex123',
      age: 25,
    }

    it('Cadastro realizado com sucesso.', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(200)

      expect(response.body.result).toHaveProperty('_id')
      expect(response.body.result.name).toBe('Alex')
      expect(response.body.result.email).toBe('alex@gmail.com')
      expect(response.body.result.age).toBe(25)
    });

    it('Retorna um erro caso já exista um usuário com o mesmo email.', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)

      expect(response.body.message).toBe('Nome ou email já esta em uso por outro usuário.')
      expect(response.status).toBe(400)
    })

    it('Retorna um erro caso o nome não seja informado', async () => {
      const createUserDtoWithoutEmail = {
        email: 'alex@gmail.com',
        password: 'alex123',
        age: 25,
      }

      const response = await request(app.getHttpServer())
       .post('/users')
       .send(createUserDtoWithoutEmail)
       
       expect(response.body?.message[1]).toBe("O nome deve ser informado.")
       expect(response.statusCode).toBe(400)
    })
  })
});
