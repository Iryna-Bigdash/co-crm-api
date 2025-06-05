// import { NestFactory, HttpAdapterHost } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { AllExceptionsFilter } from './all-exceptions.filter';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule); 

//   const { httpAdapter } = app.get(HttpAdapterHost)
//   app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))

//   app.enableCors()
//   app.setGlobalPrefix('api')
//   await app.listen(3000);
// }
// bootstrap();


import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Роздаємо статичні файли з папки uploads (наприклад, для файлів, які завантажуються)
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Підключаємо глобальний фільтр обробки помилок
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Вмикаємо CORS (дозволяємо запити з інших доменів)
  app.enableCors();

  // Встановлюємо глобальний префікс для усіх роутів
  app.setGlobalPrefix('api');

  // Визначаємо порт із змінних середовища або дефолтний 3000
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(`🚀 Server started on http://localhost:${PORT}`);
}
bootstrap();

