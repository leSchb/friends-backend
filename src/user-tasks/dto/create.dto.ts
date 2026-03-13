import { IsDateString, IsNotEmpty } from 'class-validator';
import { CreateTaskDto } from 'src/tasks/dto';

export class CreateUserTaskDto extends CreateTaskDto {
  @IsNotEmpty()
  @IsDateString()
  dueDate: Date;
}
