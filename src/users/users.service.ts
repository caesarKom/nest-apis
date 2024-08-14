import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, genAPIKey } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DbService } from 'src/db/db.service';
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private db: DbService) {}
  
  async create(createUserDto: CreateUserDto) {
    const isExist = await this.findOneByEmail(createUserDto.email);
    if (isExist) {
      return { msg: "User already exist on system"}
    }
    const hashPwd = await bcrypt.hash(createUserDto.password, 12)
    
    return await this.db.user.create({ data: {
      ...createUserDto,
      apiKey: genAPIKey(),
      password: hashPwd,
    }})
  }

  async findAll() {
    return await this.db.user.findMany({})
  }

  async findOneById(id: string) {
    return await this.db.user.findUnique({ where: { id }})
  }
  
  async findOneByEmail(email: string) {
    return await this.db.user.findUnique({ where: { email }})
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const user = await this.findOneById(id);
    if (!user) throw new NotFoundException(`No user found`);
    await this.db.user.delete({where:{id: user.id}})
    return { message: `User removed id: ${id}`}
  }
}
