import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';
import { Controller, Get, Post, Body, Param, Delete, Put, Query, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    const userId = req.user.id;
    console.log(createTaskDto);
    
    return this.taskService.create(createTaskDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Req() req
  ) {
    const userId = req.user.id;
    return this.taskService.findAll(
      { page: Number(page) || 1, limit: Number(limit) || 10 },
      userId
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    return this.taskService.findOne(Number(id), userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto, @Req() req) {
    const userId = req.user.id;
    return this.taskService.update(Number(id), updateTaskDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    return this.taskService.remove(Number(id), userId);
  }
}


