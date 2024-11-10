import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt-auth.strategy';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get('JWT_SECRET');
        
        if (!jwtSecret) {
          throw new Error('JWT_SECRET is not defined in the environment variables');
        }
        
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '60m' },
        };
      },
    }),
    forwardRef(() => AuthModule),
  ],
  providers: [JwtStrategy],
  exports: [JwtStrategy],
})
export class JwtAuthModule {}
