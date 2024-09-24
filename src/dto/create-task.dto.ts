import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Priority } from 'src/enum/priority.enum';
import { Status } from 'src/enum/status.enum';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of new task',
    example: 'Clean the house',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The content of new task',
    example: 'To vacuum',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'Priority of the task',
    example: 'HIGH',
  })
  @IsOptional()
  @IsEnum(Priority)
  priority: Priority;

  @ApiPropertyOptional({
    description: 'Status of the task',
    example: 'Done',
  })
  @IsOptional()
  @IsEnum(Status)
  status: Status;
}
