import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api/v1/bff', {
    exclude: ['/bff/docs', '/bff/docs-json'],
  });

  const config = new DocumentBuilder()
    .setTitle('Hub Empresarial - BFF')
    .setDescription(
      'Backend for Frontend: agrega datos de ms-operacion y ms-facturacion en un solo payload, con Circuit Breaker por dependencia.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('bff/docs', app, document);

  const port = process.env.PORT ?? 8010;
  await app.listen(port);
}
bootstrap();
