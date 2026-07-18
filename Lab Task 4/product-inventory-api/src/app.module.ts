import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ProductsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'sahedahmed',
      password: '123',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}