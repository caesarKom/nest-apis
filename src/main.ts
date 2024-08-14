import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const port = process.env.PORT || 10000;

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.use(helmet());
  
  await app.listen(port, async () =>
    console.log(`Server start on ${await app.getUrl()}/v1`)
  );
}
bootstrap();
