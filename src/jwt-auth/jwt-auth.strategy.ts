import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Extrae el token del encabezado de autorización
      secretOrKey: configService.get('JWT_SECRET'),  // Usa la clave secreta configurada en el .env
    });
  }

  async validate(payload: JwtPayload) {
    // Aquí puedes agregar lógica para verificar si el usuario existe, etc.
    return this.authService.validateUser(payload.userId);
  }
}
