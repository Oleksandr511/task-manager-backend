import { IsEnum, IsOptional } from 'class-validator';
import { Priority } from 'src/enum/priority.enum';
import { Status } from 'src/enum/status.enum';

export class GetTaskFilterDto {
  @IsOptional()
  @IsEnum(Status, { message: 'Invalid status value' })
  status?: Status;

  @IsOptional()
  @IsEnum(Priority, { message: 'Invalid priority value' })
  priority?: Priority;
}
