import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(1)
  limit: number = 10;
}
