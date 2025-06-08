import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class MathController {
  @MessagePattern({ cmd: 'sum' })
  calculateSum(data: number[]): number {
    return data.reduce((a, b) => a + b, 0);
  }

  @MessagePattern({ cmd: 'multiply' })
  calculateProduct(data: number[]): number {
    return data.reduce((a, b) => a * b, 1);
  }
}
