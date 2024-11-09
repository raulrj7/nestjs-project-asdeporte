import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto, Status } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        dueDate: createTaskDto.dueDate?  new Date(createTaskDto.dueDate): null,
        status: createTaskDto.status ?  createTaskDto.status : Status.PENDING,
        userId,
      },
    });
  }


async findAll({ page = 1, limit = 10 }: { page: number; limit: number }, userId: number) {
  const skip = (page - 1) * limit;
  
  console.log('PARAMETROS', page, limit, userId);

  if (isNaN(skip) || isNaN(limit)) {
    throw new Error("Los parámetros 'page' y 'limit' deben ser números.");
  }

  const tasks = await this.prisma.task.findMany({
    skip,
    take: limit,
    where: { userId },
  });

  const totalCount = await this.prisma.task.count({
    where: { userId },
  });

  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: tasks,
    meta: {
      totalCount,
      totalPages,
      currentPage: page,
      perPage: limit,
    },
  };
}


  async findOne(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id, userId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found or unauthorized');
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        title: updateTaskDto.title,
        description: updateTaskDto.description,
        dueDate: new Date(updateTaskDto.dueDate),
        status: updateTaskDto.status as Status,
      },
    });
  }

  async remove(taskId: number, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
  
    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found or unauthorized');
    }
  
    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }
  
}
