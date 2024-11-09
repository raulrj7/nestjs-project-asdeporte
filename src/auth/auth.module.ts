// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module';  // Asegúrate de que este módulo esté importado
import { PrismaModule } from "../../prisma/prisma.module";
import { AuthController } from './auth.ctrl';

@Module({
  imports: [
    PrismaModule,       // PrismaModule para acceder a los datos de la base de datos
    ConfigModule,       // Configuración de variables de entorno
    JwtAuthModule,      // Módulo JWT
    JwtModule,          // Módulo para manejar JWT en NestJS
  ],
  controllers: [AuthController],  // Controladores de la aplicación
  providers: [AuthService],       // Servicios que proporciona el módulo
  exports: [AuthService, JwtAuthModule],  // Exporta los servicios necesarios
})
export class AuthModule {}
