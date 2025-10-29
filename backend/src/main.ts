import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 启用CORS以支持前端连接
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  
  // 启用全局验证管道
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3001);
  console.log('Backend server is running on http://localhost:3001');
}
bootstrap();
