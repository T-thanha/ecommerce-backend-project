import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'node:path/win32';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProductModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'product',
        protoPath: join(__dirname, '../../../proto/product.proto'),
        url: 'localhost:50052',
        loader: {
          keepCase: true,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
