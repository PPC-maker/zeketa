import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService, ImportResult } from './import.service';

@Controller('api/import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('csv')
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(
    @UploadedFile() file: Express.Multer.File,
    @Body('limitPerCategory') limitPerCategory?: string,
  ): Promise<ImportResult> {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const limit = parseInt(limitPerCategory || '0', 10);
    const content = file.buffer.toString('utf-8');

    const result = await this.importService.importCsv(content, limit);

    return result;
  }

  @Delete('products')
  async clearProducts() {
    await this.importService.clearAllProducts();
    return { message: 'All products cleared' };
  }

  @Delete('categories')
  async clearCategories() {
    await this.importService.clearAllCategories();
    return { message: 'All categories cleared' };
  }
}
