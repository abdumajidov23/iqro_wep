import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function start() {
  const PORT = process.env.PORT || 3001;
  const app = await NestFactory.create(AppModule);

  // Agar CORS kerak bo'lsa, uni yoqish
  // app.enableCors();  // Agar CORS kerak bo'lsa, izohni olib tashlang

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //   }),
  // );

  app.use(cookieParser());
  
  const config = new DocumentBuilder()
    .setTitle('iqro_wep')
    .setDescription('quran uchun API.')
    .setVersion('1.0')
    // .addTag('Mashinlar')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Serverni ishga tushurish
  await app.listen(PORT, () => {
    console.log()
    console.log(`hello`);
    console.log(`Server http://localhost:${PORT}/api`);
    console.log()

    // console.log(`Swagger hujjatlari: http://localhost:${PORT}/api`);
  });
}

start();
