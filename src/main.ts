import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS si es necesario
  app.enableCors();

  // Usar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no declaradas
      forbidNonWhitelisted: true, // Lanza un error si hay propiedades no permitidas
    }),
  );

  const port = process.env.PORT || 3000; // Usar puerto del entorno o por defecto
  await app.listen(port);
  logger.log(`Auth Running On Port ${port}`);
}

bootstrap();
