import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.ctrl';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
