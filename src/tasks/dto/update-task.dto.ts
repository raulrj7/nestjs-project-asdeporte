import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({ description: 'The title of the task', required: false })
  title?: string;

  @ApiProperty({ description: 'The description of the task', required: false })
  description?: string;

  @ApiProperty({ description: 'The due date of the task', required: false })
  dueDate?: Date | null;

  @ApiProperty({
    description: 'The status of the task',
    enum: Status,
    enumName: 'Status',
    required: false,
  })
  status?: Status;
}
