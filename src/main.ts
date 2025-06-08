import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CatchEverythingFilter } from './common/filters/GloabalExceptionFilter';
import { HttpAdapterHost } from '@nestjs/core';
import { configDotenv } from 'dotenv';
import { TransformResponseInterceptor } from './common/interceptors/transform-res-interceptor';

configDotenv();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown properties
      forbidNonWhitelisted: true,
      transform: true, // enables type conversion
    }),
  );
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap()
  .then(() => {
    console.log('Application started successfully');
  })
  .catch((error) => {
    console.error('Error starting application:', error);
    process.exit(1);
  });
