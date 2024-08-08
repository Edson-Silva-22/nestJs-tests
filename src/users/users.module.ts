import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/schemas/users';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'users', schema: userSchema}
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
