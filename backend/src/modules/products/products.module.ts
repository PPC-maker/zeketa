import { Module } from '@nestjs/common';
import { ProductsController, CategoriesController, GenderController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ProductsController, CategoriesController, GenderController],
  providers: [ProductsService, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}
