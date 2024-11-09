import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';  // Asegúrate de importar esto
import { AuthModule } from './auth/auth.module'; 
import { TaskModule } from './tasks/task.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Esto garantiza que esté accesible globalmente
    }),
    AuthModule,
    TaskModule,
  ],
})
export class AppModule {}
