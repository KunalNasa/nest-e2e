import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() //marks this controller as a Nest.js controller
export class AppController {
  // inject AppService dependency into this conroller
  constructor(private readonly appService: AppService) {}

  // Map HTTP GET requests sent to the "/sum" endpoint to the appService's "calculateSum" method.
  @Get('sum')
  async getSum(): Promise<number> {
    return this.appService.calculateSum([5, 10, 15]);
  }

  // Map HTTP GET requests sent to the "/capitalize" endpoint to the appService's "capitalizeString" method.
  @Get('capitalize')
  async getCapitalizedString(): Promise<string> {
    return this.appService.capitalizeString('hello world');
  }
}
