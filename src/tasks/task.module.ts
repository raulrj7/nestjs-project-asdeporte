import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.ctrl';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
