import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Gestión de Tareas')
    .setDescription('Documentación de la API de gestión de tareas')
    .setVersion('1.0')
    .addTag('tasks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Agregar endpoint para descargar el JSON de Swagger
  app.use('/swagger-json', (req, res) => res.json(document));

  app.enableCors();

  // Configuración de ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,  // Habilita la transformación de datos
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Auth Running On Port ${port}`);
}

bootstrap();
