import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto, Status } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtService } from '@nestjs/jwt';
import { TaskResponse } from './dto/task.response.dto';
import { PaginationDto } from "./dto/pagination.dto";

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<TaskResponse> {
    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
        status: createTaskDto.status ? createTaskDto.status : Status.PENDING,
        userId,
      },
    });

    return this.mapToTaskResponse(task);
  }

  private mapToTaskResponse(task: any): TaskResponse {
    const dueDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: dueDate.toISOString(),
      status: task.status as Status,
      userId: task.userId,
    };
  }

  async findAll(paginationDto: PaginationDto, userId: number): Promise<{ data: TaskResponse[]; meta: any }> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
  
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
      data: tasks.map(this.mapToTaskResponse),
      meta: {
        totalCount,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    };
  }

  async findOne(id: number, userId: number): Promise<TaskResponse> {
    const task = await this.prisma.task.findUnique({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.mapToTaskResponse(task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number): Promise<TaskResponse> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found or unauthorized');
    }
    const updateData: any = {};
  
    if (updateTaskDto.title !== undefined) {
      updateData.title = updateTaskDto.title;
    }
    if (updateTaskDto.description !== undefined) {
      updateData.description = updateTaskDto.description;
    }
    if (updateTaskDto.dueDate !== undefined) {
      updateData.dueDate = updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : null;
    }
    if (updateTaskDto.status !== undefined) {
      updateData.status = updateTaskDto.status;
    }
  
    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  
    return this.mapToTaskResponse(updatedTask);
  }
  

  async remove(taskId: number, userId: number): Promise<{ message: string }> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
  
    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found or unauthorized');
    }
  
    await this.prisma.task.delete({
      where: { id: taskId },
    });
  
    return { message: 'Task successfully deleted' };
  }  
  
}
