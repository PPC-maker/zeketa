import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { ImportModule } from './modules/import/import.module';
import { AuthModule } from './modules/auth/auth.module';
import { LogsModule } from './modules/logs/logs.module';

@Module({
  imports: [LogsModule, AuthModule, ProductsModule, ImportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
