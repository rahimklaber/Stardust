import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const options = {
  //   origin: "*",
  //   methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204,
  //   credentials: true
  // };

  app.enableCors({
    origin:"*"
  });
  await app.listen(8080);
}
bootstrap();
