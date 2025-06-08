/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class AppService {
  private mathClient: ClientProxy;
  private stringClient: ClientProxy;

  // below, we initialize the two client proxies (mathClient and stringClient) to enable communication with them using TCP. Each proxy is configured to connect to a specific service running on localhost but on different ports (3001 for the math service and 3002 for the string service).
  constructor() {
    this.mathClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 3001 },
    });
    this.stringClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 3002 },
    });
  }

  async calculateSum(numbers: number[]): Promise<number> {
    return this.mathClient.send({ cmd: 'sum' }, numbers).toPromise();
  }

  async capitalizeString(data: string): Promise<string> {
    return this.stringClient.send({ cmd: 'capitalize' }, data).toPromise();
  }
}
