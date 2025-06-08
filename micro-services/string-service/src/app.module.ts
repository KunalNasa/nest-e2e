import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StringController } from './string.controller';

@Module({
  imports: [],
  controllers: [AppController, StringController],
  providers: [AppService],
})
export class AppModule {}
