import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Priority } from 'src/enum/priority.enum';
import { Status } from 'src/enum/status.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;
}
