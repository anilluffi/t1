import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    //console.log("JWT в заголовке:", request.headers.authorization);//log
    
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    try {
      const token = authHeader.split(' ')[1];
      const decoded = this.jwtService.verify(token);
      //console.log("Расшифрованный токен:", decoded);//log
      request.user = decoded;
      return true;
    } catch (error) {
      console.error("Token validation error: ", error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
