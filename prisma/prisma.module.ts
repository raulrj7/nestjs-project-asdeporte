import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],  // Asegúrate de exportarlo para usarlo en otros módulos
})
export class PrismaModule {}