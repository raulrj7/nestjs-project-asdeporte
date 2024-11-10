import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum Status {
  PENDING = 'PENDING',
  PROCESS = 'PROCESS',
  COMPLETED = 'COMPLETED',
}

export class CreateTaskDto {
  @ApiProperty({ description: 'The title of the task' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The description of the task' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'The due date of the task', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({
    description: 'The status of the task',
    enum: Status,
    enumName: 'Status',
    default: Status.PENDING,
  })
  @IsEnum(Status)
  @IsOptional()
  @Transform(({ value }) => value ?? Status.PENDING)
  status: Status;
}
