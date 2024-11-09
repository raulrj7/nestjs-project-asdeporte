import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

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

  @IsOptional() // Hacemos que dueDate sea opcional
  @IsDateString()
  dueDate?: string; // Puede ser undefined si no se pasa

  @IsEnum(Status)
  @IsOptional() // status es opcional, pero si no se pasa, se asignará "PENDING"
  @Transform(({ value }) => value ?? Status.PENDING) // Asigna el valor "PENDING" si no se pasa
  status: Status;
}
