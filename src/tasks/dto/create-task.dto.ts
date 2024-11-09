import { IsString, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';

export enum Status {
  PENDING = 'PENDING',
  PROCESS = 'PROCESS',
  COMPLETED = 'COMPLETED',
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
