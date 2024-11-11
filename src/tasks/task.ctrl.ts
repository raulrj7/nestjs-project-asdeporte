import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from './dto/pagination.dto'; // Importa el DTO de paginación
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description: 'Requires a Bearer token in the Authorization header to create a task.',
  })
  @ApiResponse({ status: 201, description: 'Task successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateTaskDto })
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    const userId = req.user.id;
    return this.taskService.create(createTaskDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all tasks with pagination',
    description: 'Requires a Bearer token in the Authorization header to retrieve tasks.',
  })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() paginationDto: PaginationDto, @Req() req) {
    const userId = req.user.id;
    return this.taskService.findAll(paginationDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific task by ID',
    description: 'Requires a Bearer token in the Authorization header to retrieve a task by ID.',
  })
  @ApiParam({ name: 'id', description: 'Task ID', type: Number })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    return this.taskService.findOne(Number(id), userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({
    summary: 'Update a task by ID',
    description: 'Requires a Bearer token in the Authorization header to update a task.',
  })
  @ApiParam({ name: 'id', description: 'Task ID', type: Number })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found or unauthorized' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: UpdateTaskDto })
  async update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto, @Req() req) {
    const userId = req.user.id;
    return this.taskService.update(Number(id), updateTaskDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a task by ID',
    description: 'Requires a Bearer token in the Authorization header to delete a task.',
  })
  @ApiParam({ name: 'id', description: 'Task ID', type: Number })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found or unauthorized' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    return this.taskService.remove(Number(id), userId);
  }
}
