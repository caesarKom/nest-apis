import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 10000;

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  await app.listen(port, async () =>
    console.log(`Server start on ${await app.getUrl()}/v1`)
  );
}
bootstrap();
