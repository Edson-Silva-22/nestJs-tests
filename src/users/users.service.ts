import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import User from 'src/schemas/users';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel('users') private userModel: typeof User
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const ifUserExist = await this.userModel.find({name: createUserDto.name})

      if (ifUserExist.length > 0) {
        return {
          message: 'Já existe um usuário com esse nome.',
          status: 400
        }
      }

      const createUser = await this.userModel.create(createUserDto)
      createUser.save()
      
      return {
        result: createUser,
        status: 200,
      }

    } catch (error) {
      console.error(error)
      return {
        message: 'Erro ao salvar o usuário.',
        status: 500
      }
    }
  }

  async findAll() {
    try {
      const findAllUsers = await this.userModel.find()

      return {
        result: findAllUsers,
        status: 200,
      }
    } catch (error) {
      console.error(error)
      return {
        message: 'Erro ao buscar os usuários.',
        status: 500
      }
    }
  }

  async findOne(id: string) {
    try {
      const ifUserExist = await this.userModel.find({_id: id})

      if (ifUserExist.length == 0) {
        return {
          message: 'Usuário não foi encontrado.',
          status: 400
        }
      }

      return {
        result: ifUserExist[0],
        status: 200,
      }

    } catch (error) {
      console.error(error)
      return {
        message: 'Erro ao buscar o usuário.',
        status: 500
      }
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const ifUserExist = await this.userModel.find({_id: id})

      if (ifUserExist.length == 0) {
        return {
          message: 'Usuário não foi encontrado.',
          status: 400
        }
      }

      await this.userModel.updateOne({_id: id}, updateUserDto)

      return {
        message: 'Usuário atualizado com sucesso.',
        status: 200,
      }
    } catch (error) {
      console.error(error)
      return {
        message: 'Erro ao atualizar o usuário.',
        status: 500
      }
    }
  }

  async remove(id: string) {
    try {
      const ifUserExist = await this.userModel.find({_id: id})

      if (ifUserExist.length == 0) {
        return {
          message: 'Usuário não foi encontrado.',
          status: 400
        }
      }

      await this.userModel.deleteOne({_id: id})

      return {
        message: 'Usuário excluído com sucesso.',
        status: 200,
      }
    } catch (error) {
      console.error(error)
      return {
        message: 'Erro ao excluir o usuário.',
        status: 500
      }
    }
  }
}
