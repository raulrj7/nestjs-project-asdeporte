import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto, Status } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        dueDate: new Date(createTaskDto.dueDate),
        status: createTaskDto.status as Status, // Confirma que el status sea del tipo Status
      },
    });
  }

  async findAll({ page, limit }: { page: number; limit: number }) {
    const skip = (page - 1) * limit;
    const tasks = await this.prisma.task.findMany({
      skip,
      take: limit,
    });
    return { data: tasks, page, limit };
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: {
        title: updateTaskDto.title,
        description: updateTaskDto.description,
        dueDate: new Date(updateTaskDto.dueDate),
        status: updateTaskDto.status as Status, // Confirma que el status sea del tipo Status
      },
    });
  }

  async remove(id: number) {
    await this.prisma.task.delete({ where: { id } });
    return { message: 'Task deleted successfully' };
  }
}
