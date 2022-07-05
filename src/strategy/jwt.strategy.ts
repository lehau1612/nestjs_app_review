import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY_JWT,
    });
  }
  
  async validate(token): Promise<any> {
    if (Date.now() > token.exp) {
      return new HttpException('Token exprired!!',HttpStatus.UNAUTHORIZED)
    }
    return {userId:token.id, email: token.email, role: token.role_name ,managerId:token.manager_id};
  }

}