import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'user email',
    example: 'user@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'user name',
    example: 'User',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'users password',
    example: '1234',
  })
  @IsNotEmpty()
  password: string;
}
