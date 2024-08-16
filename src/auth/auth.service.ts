import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DbService } from 'src/db/db.service';
import { AuthEnity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, genAPIKey } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private db: DbService,
    private jwtService: JwtService,
    private userService: UsersService
  ) {}

  async login(email: string, password: string): Promise<AuthEnity> {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      at: this.jwtService.sign({ userId: user.id })
    };
  }

  async register(createUserDto: CreateUserDto) {
    const isExist = await this.userService.findOneByEmail(createUserDto.email);
    if (isExist) {
      return { msg: "User already exist on system"}
    }
    const hashPwd = await bcrypt.hash(createUserDto.password, 12)
    
    await this.db.user.create({ data: {
      username: createUserDto.username,
      email: createUserDto.email,
      apiKey: genAPIKey(),
      password: hashPwd,
    }})

    return { message: 'User registered successfully' };
  }

  async getApiKey(user: User) {
    const key = await this.db.user.findUnique({
      where: { apiKey: user.apiKey }
    });
    if (!key) {
      throw new NotFoundException(`Not Found Key!`);
    }
    return { apiKey: key.apiKey };
  }
}
