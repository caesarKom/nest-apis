import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DbService } from 'src/db/db.service';
import { AuthEnity } from './entity/auth.entity';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(private db: DbService, private jwtService: JwtService) {}
    
    async login(email:string,password:string): Promise<AuthEnity> {
        const user = await this.db.user.findUnique({where:{email}});
        if (!user) {
            throw new NotFoundException(`No user found for email: ${email}`)
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
          }
          return {
            at: this.jwtService.sign({ userId: user.id })
          }
    }
}
