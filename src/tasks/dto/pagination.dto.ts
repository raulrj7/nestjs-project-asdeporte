import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @Type(() => Number)
  @IsInt({ message: "'page' debe ser un número entero" })
  @Min(1, { message: "'page' debe ser al menos 1" })
  page: number = 1;

  @Type(() => Number)
  @IsInt({ message: "'limit' debe ser un número entero" })
  @Min(1, { message: "'limit' debe ser al menos 1" })
  limit: number = 10;
}
