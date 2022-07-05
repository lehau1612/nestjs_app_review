import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config'
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const port = process.env.PORT || 8080
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const option = new DocumentBuilder()
    .setTitle('my-API')
    .setDescription('API')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'JWT', description: 'Enter JWT Token', in: 'header' },
      'JWT-auth'
    )
    .build()
  const document = SwaggerModule.createDocument(app, option)
  SwaggerModule.setup('api',app,document)
  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap')

}
bootstrap();
