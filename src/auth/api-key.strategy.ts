import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DbService } from 'src/db/db.service';

@Injectable()
export class ApiKey implements NestMiddleware {
    constructor(private db: DbService) {}
    
    async use(req: Request, res: Response, next: NextFunction) {
        const apiKey = req.headers.authorization;
        const account = await this.db.user.findFirst({where: { apiKey }})
        
        if (!account && account.apiKey !== apiKey) {
            throw new UnauthorizedException();
        }
        
        return next();
    }
}