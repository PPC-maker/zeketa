import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { ImportModule } from './modules/import/import.module';

@Module({
  imports: [ProductsModule, ImportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
