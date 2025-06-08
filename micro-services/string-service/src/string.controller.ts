import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class StringController {
  @MessagePattern({ cmd: 'concat' })
  concatenateStrings(data: string[]): string {
    return data.join(' ');
  }

  @MessagePattern({ cmd: 'capitalize' })
  capitalizeString(data: string): string {
    return data.toUpperCase();
  }
}
