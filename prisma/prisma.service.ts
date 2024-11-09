import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Modificamos la función para utilizar la transacción correctamente
  async runInTransaction(callback: (prisma: PrismaService) => Promise<any>) {
    return this.$transaction(async (prismaTransaction) => {
      // PrismaTransaction ahora es un objeto con acceso a las operaciones de Prisma
      // Podemos pasarle la instancia de PrismaService que tiene el comportamiento completo
      const prismaService = new PrismaService();
      return callback(prismaService);  // Ahora pasamos la instancia completa de PrismaService
    });
  }
}
