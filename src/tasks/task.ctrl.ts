// task.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(JwtAuthGuard)  // Usa el guard en el método POST
  create(@Body() createTaskDto: CreateTaskDto) {
    console.log(createTaskDto);
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)  // Usa el guard en el método GET
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.taskService.findAll({ page, limit });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)  // Usa el guard en el método GET para un ID específico
  findOne(@Param('id') id: number) {
    return this.taskService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)  // Usa el guard en el método PUT
  update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)  // Usa el guard en el método DELETE
  remove(@Param('id') id: number) {
    return this.taskService.remove(id);
  }
}
