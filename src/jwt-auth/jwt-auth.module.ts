// jwt-auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt-auth.strategy';
import { AuthModule } from '../auth/auth.module';  // Importa AuthModule para acceder a AuthService

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),  // Clave secreta para firmar los JWT
        signOptions: { expiresIn: '60m' },  // Tiempo de expiración del token
      }),
    }),
    forwardRef(() => AuthModule),  // Usa forwardRef para evitar dependencias circulares
  ],
  providers: [JwtStrategy],  // Se asegura de que la estrategia se registre aquí
  exports: [JwtStrategy],    // Exporta para ser utilizada en otros módulos
})
export class JwtAuthModule {}
