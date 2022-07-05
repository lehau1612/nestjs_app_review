import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUsers } from '../interface/user.interface';
import * as _ from 'lodash';
import jwt_decode from "jwt-decode";

export const User = createParamDecorator(async (data: unknown, ctx: ExecutionContext): Promise<IUsers> => {
  const req = ctx.switchToHttp().getRequest();
  
  const authorization: string = req.headers.authorization || req.headers.Authorization;
  const token = authorization ? authorization.split(' ')[1] : null;
  if (token){
    var decoded = jwt_decode(token);
    
    return { 
      userId: decoded['user_id'],
      email: decoded['email'],
      roleName: decoded['names'],
      managerId:decoded['manager_id'],
    };
  }
  return { 
    userId: 0,
    email: "",
    roleName: "",
    managerId:0,
  };
});