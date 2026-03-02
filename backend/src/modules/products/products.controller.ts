import { Controller, Get, Query, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.productsService.findAll({
      category,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  @Get('category/:slug')
  async findByCategory(
    @Param('slug') slug: string,
    @Query('type') type?: string,
  ) {
    return this.productsService.findByCategory(slug, type);
  }

  @Get('new')
  async getNewProducts(@Query('limit') limit?: string) {
    return this.productsService.getNewProducts(limit ? parseInt(limit, 10) : undefined);
  }

  @Get('best-sellers')
  async getBestSellers(@Query('limit') limit?: string) {
    return this.productsService.getBestSellers(limit ? parseInt(limit, 10) : undefined);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}

@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getCategories() {
    return this.productsService.getCategories();
  }

  @Get('tree')
  async getCategoryTree() {
    return this.productsService.getCategoryTree();
  }
}

@Controller('api/gender')
export class GenderController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':gender')
  async getProductsByGender(
    @Param('gender') gender: 'men' | 'women',
    @Query('limit') limit?: string,
  ) {
    return this.productsService.getProductsByGender(
      gender,
      limit ? parseInt(limit, 10) : undefined,
    );
  }
}
