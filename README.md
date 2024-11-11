
# API de Gestión de Tareas

Este proyecto es una API de gestión de tareas construida con NestJS, que permite la autenticación de usuarios y la gestión de tareas. Incluye autenticación JWT y está documentada con Swagger.

## Requisitos previos

Esta guía asume que no tienes ningún software instalado en tu Mac. Sigue los pasos para instalar Node.js y otras dependencias necesarias.

1. **Instalar Homebrew** (gestor de paquetes para macOS, si no lo tienes):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Instalar Node.js**:
   ```bash
   brew install node
   ```

3. **Instalar Postgres (opcional, si deseas probar con una base de datos local en este caso se cuenta con un rds postres)**:
   ```bash
   brew install postgresql
   ```

## Configuración del proyecto

1. **Clonar el repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd prueba-tecnica
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables, agregar los valores proporcionados.

   ```dotenv
    DATABASE_URL=
    PORT=3000
    JWT_SECRET=
   ```

## Iniciar la API

1. **Levantar el servidor en modo desarrollo**:
   ```bash
   npm run start:dev
   ```

2. La API estará disponible en `http://localhost:3000`.

## Documentación Swagger

Para ver la documentación de la API en Swagger:

1. Asegúrate de que el servidor esté en ejecución.
2. Accede a `http://localhost:3000/swagger` en tu navegador.
3. accede a `https://app.swaggerhub.com/apis-docs/RaulReyes/api-de_gestion_de_tareas/1.0#/` en tu navegador 

## Ejecución de pruebas

Para ejecutar pruebas unitarias y de integración:

1. **Ejecución de pruebas unitarias**:
   ```bash
   npm test
   ```

## Información adicional

La API se conecta a una base de datos RDS de Postgres, y las tablas necesarias ya deben estar creadas en la base de datos, por lo que no es necesario realizar migraciones con Prisma en esta configuración. Si deseas modificar la estructura de la base de datos, asegúrate de consultar la documentación de Prisma para aplicar migraciones.

## Scripts disponibles

- `npm run build`: Compila el proyecto.
- `npm run start:dev`: Inicia el servidor en modo desarrollo.
- `npm run test`: Ejecuta todas las pruebas.

---

Con estos pasos, puedes levantar y probar la API en una Mac sin software previo instalado. ¡Listo para comenzar!
