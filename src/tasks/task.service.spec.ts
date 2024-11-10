import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import { Status } from './dto/create-task.dto';

describe('TaskService', () => {
  let taskService: TaskService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    task: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    prismaService = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      const mockTasks = [
        { 
          id: 1, 
          title: 'Task 1', 
          description: 'Description 1', 
          dueDate: new Date('2024-12-01T00:00:00.000Z'),
          status: Status.PENDING, 
          userId: 1 
        },
        { 
          id: 2, 
          title: 'Task 2', 
          description: 'Description 2', 
          dueDate: new Date('2024-12-02T00:00:00.000Z'),
          status: Status.PENDING, 
          userId: 1 
        },
      ];
      const mockTotalCount = 10;

      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);
      mockPrismaService.task.count.mockResolvedValue(mockTotalCount);

      const result = await taskService.findAll({ page: 1, limit: 2 }, 1);
      expect(result).toEqual({
        data: mockTasks.map(task => ({
          ...task,
          dueDate: task.dueDate.toISOString(),
        })),
        meta: {
          totalCount: mockTotalCount,
          totalPages: 5,
          currentPage: 1,
          perPage: 2,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a task if it exists', async () => {
      const mockTask = { 
        id: 1, 
        title: 'Task 1', 
        description: 'Description 1', 
        dueDate: new Date('2024-12-01T00:00:00.000Z'), 
        status: Status.PENDING, 
        userId: 1 
      };
      mockPrismaService.task.findUnique.mockResolvedValue(mockTask);

      const result = await taskService.findOne(1, 1);
      expect(result).toEqual({
        ...mockTask,
        dueDate: mockTask.dueDate.toISOString(),
      });
    });

    it('should throw NotFoundException if task is not found', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(taskService.findOne(1, 1)).rejects.toThrowError(
        new NotFoundException('Task not found'),
      );
    });
  });

  describe('create', () => {
    it('should create and return a task', async () => {
      const createTaskDto = {
        title: 'Task Title',
        description: 'Task Description',
        dueDate: new Date('2024-11-09T00:00:00Z'),
        status: Status.PENDING,
      };

      const mockCreatedTask = { 
        id: 1, 
        ...createTaskDto, 
        dueDate: createTaskDto.dueDate.toISOString(), 
        userId: 1 
      };
      mockPrismaService.task.create.mockResolvedValue(mockCreatedTask);

      const result = await taskService.create(createTaskDto, 1);
      expect(result).toEqual(mockCreatedTask);
    });
  });

  describe('update', () => {
    it('should update and return an existing task', async () => {
      const updatedTaskDto = { title: 'Updated Task', description: 'Updated Description' };
      const mockTask = { 
        id: 1, 
        title: 'Task 1', 
        description: 'Description 1', 
        dueDate: new Date('2024-12-01T00:00:00.000Z'), 
        status: Status.PENDING, 
        userId: 1 
      };

      mockPrismaService.task.findUnique.mockResolvedValue(mockTask);
      mockPrismaService.task.update.mockResolvedValue({ ...mockTask, ...updatedTaskDto });

      const result = await taskService.update(1, updatedTaskDto, 1);
      expect(result).toEqual({
        ...mockTask,
        ...updatedTaskDto,
        dueDate: mockTask.dueDate.toISOString(),
      });
    });
  });

  describe('remove', () => {
    it('should remove and return a task', async () => {
      const mockTask = { 
        id: 1, 
        title: 'Task 1', 
        description: 'Description 1', 
        dueDate: new Date('2024-12-01T00:00:00.000Z'), 
        status: Status.PENDING, 
        userId: 1 
      };
      mockPrismaService.task.findUnique.mockResolvedValue(mockTask);
      mockPrismaService.task.delete.mockResolvedValue(mockTask);

      const result = await taskService.remove(1, 1);
      expect(result).toEqual({
        ...mockTask,
        dueDate: mockTask.dueDate.toISOString(),
      });
    });
  });
});
