import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: [],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }


  async runInTransaction(callback: (prisma: PrismaService) => Promise<any>) {
    return this.$transaction(async (prismaTransaction) => {
      const prismaService = new PrismaService();
      return callback(prismaService);
    });
  }
}
