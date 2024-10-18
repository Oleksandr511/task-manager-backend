import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const PORT = process.env.PORT || 8000;
  const httpsOptions = {
    key: fs.readFileSync('./secrets/cert.key'),
    cert: fs.readFileSync('./secrets/cert.crt'),
  };

  const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   // origin: 'http://127.0.0.1:8081',
  //   // origin: 'http://10.0.2.2:8081',
  //   origin: '*',
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
  //   credentials: true, // Якщо ти використовуєш кукі або сесії
  // });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Task manager API')
    .setDescription('Task manager API description')
    .setVersion('1.0')
    .addTag('Practice')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8000, () => console.log(`Server started on port ${PORT}`));
}
bootstrap();
