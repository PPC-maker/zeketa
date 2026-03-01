import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as csv from 'csv-parse/sync';

interface CsvRow {
  'מזהה': string;
  'סוג': string;
  'מק"ט': string;
  'שם': string;
  'פורסם': string;
  'תיאור': string;
  'מחיר מבצע': string;
  'מחיר רגיל': string;
  'קטגוריות': string;
  'תגיות': string;
  'תמונות': string;
  'מלאי': string;
  'מידה': string;
}

export interface ImportResult {
  imported: number;
  failed: number;
  errors: string[];
  categories: string[];
}

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);

  constructor(private prisma: PrismaService) {}

  async importCsv(fileContent: string, limitPerCategory: number = 0): Promise<ImportResult> {
    const result: ImportResult = {
      imported: 0,
      failed: 0,
      errors: [],
      categories: [],
    };

    try {
      // Parse CSV
      const records = csv.parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
        relaxColumnCount: true,
      }) as CsvRow[];

      this.logger.log(`Parsed ${records.length} rows from CSV`);

      // Track categories per parent for limiting
      const categoryProductCount: Record<string, number> = {};
      const createdCategories = new Set<string>();

      // First pass: Create all categories
      for (const row of records) {
        const categoriesStr = row['קטגוריות'] || '';
        if (!categoriesStr) continue;

        // Parse categories like "גברים > בגדים, נשים > בגדים, גברים > בגדים > גופייה"
        const categoryPaths = categoriesStr.split(',').map(c => c.trim());

        for (const path of categoryPaths) {
          await this.ensureCategoryPath(path, createdCategories);
        }
      }

      result.categories = Array.from(createdCategories);

      // Second pass: Import products
      for (const row of records) {
        try {
          // Skip if not a product/variation
          if (row['סוג'] !== 'variation' && row['סוג'] !== 'simple') continue;

          const sku = row['מק"ט']?.trim();
          if (!sku) {
            result.errors.push(`Missing SKU for product: ${row['שם']}`);
            result.failed++;
            continue;
          }

          // Get categories
          const categoriesStr = row['קטגוריות'] || '';
          const categoryPaths = categoriesStr.split(',').map(c => c.trim()).filter(Boolean);

          if (categoryPaths.length === 0) {
            result.errors.push(`No categories for product: ${sku}`);
            result.failed++;
            continue;
          }

          // Get the most specific category (last in path)
          const mainCategoryPath = categoryPaths[0];
          const mainCategory = await this.getCategoryByPath(mainCategoryPath);

          if (!mainCategory) {
            result.errors.push(`Category not found for: ${sku}`);
            result.failed++;
            continue;
          }

          // Check limit per category
          const parentPath = this.getParentPath(mainCategoryPath);
          if (limitPerCategory > 0) {
            categoryProductCount[parentPath] = (categoryProductCount[parentPath] || 0);
            if (categoryProductCount[parentPath] >= limitPerCategory) {
              continue; // Skip, limit reached
            }
          }

          // Parse prices
          const regularPrice = parseFloat(row['מחיר רגיל']?.replace(/[^\d.]/g, '') || '0');
          const salePrice = parseFloat(row['מחיר מבצע']?.replace(/[^\d.]/g, '') || '0');

          // Parse images
          const imagesStr = row['תמונות'] || '';
          const images = imagesStr
            .split(',')
            .map(url => url.trim())
            .filter(url => url.startsWith('http'))
            .slice(0, 5); // Limit to 5 images

          // Parse tags
          const tagsStr = row['תגיות'] || '';
          const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

          // Parse size from row or SKU
          const sizeMatch = sku.match(/-([smlx]{1,2}|xl|xxl)$/i);
          const size = row['שיוך 1 ערכים']?.trim() || (sizeMatch ? sizeMatch[1].toUpperCase() : 'M');

          // Check if product already exists
          const existingProduct = await this.prisma.product.findUnique({
            where: { sku },
          });

          // Determine gender from categories
          const isForMen = categoryPaths.some(p => p.includes('גברים'));
          const isForWomen = categoryPaths.some(p => p.includes('נשים'));
          const genderTag = isForMen && isForWomen ? 'unisex' : (isForMen ? 'men' : 'women');

          const productData = {
            nameHe: row['שם']?.trim() || 'ללא שם',
            nameEn: this.translateToEnglish(row['שם']?.trim() || 'No name'),
            descHe: row['תיאור']?.trim() || '',
            descEn: '',
            priceUsd: Math.round(regularPrice / 3.7 * 100) / 100, // Convert ILS to USD
            priceIls: regularPrice,
            salePrice: salePrice > 0 && salePrice < regularPrice ? salePrice : null,
            images,
            sizes: [size],
            colors: [],
            tags: [...tags, genderTag],
            stock: parseInt(row['מלאי'] || '10', 10),
            isActive: row['פורסם'] === '1',
            isNew: false,
            isBestSeller: false,
            isFeatured: false,
            categoryId: mainCategory.id,
          };

          if (existingProduct) {
            await this.prisma.product.update({
              where: { sku },
              data: productData,
            });
          } else {
            await this.prisma.product.create({
              data: {
                sku,
                ...productData,
              },
            });
          }

          categoryProductCount[parentPath] = (categoryProductCount[parentPath] || 0) + 1;
          result.imported++;
        } catch (error: any) {
          this.logger.error(`Error importing row: ${error.message}`);
          result.errors.push(`Error importing ${row['מק"ט']}: ${error.message}`);
          result.failed++;
        }
      }
    } catch (error: any) {
      this.logger.error(`CSV parsing error: ${error.message}`);
      result.errors.push(`CSV parsing error: ${error.message}`);
    }

    return result;
  }

  private async ensureCategoryPath(path: string, createdCategories: Set<string>): Promise<void> {
    const parts = path.split('>').map(p => p.trim());
    let parentId: string | null = null;
    let parentSlug: string | null = null;

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const baseSlug = this.createSlug(name);
      // For subcategories, prefix with parent slug to make unique (e.g., men-tank-top, women-tank-top)
      const slug = parentSlug && i > 0 ? `${parentSlug}-${baseSlug}` : baseSlug;
      const fullPath = parts.slice(0, i + 1).join(' > ');

      // Check if category exists
      let category = await this.prisma.category.findFirst({
        where: {
          slug,
          parentId: parentId,
        },
      });

      if (!category) {
        // Create category
        category = await this.prisma.category.create({
          data: {
            nameHe: name,
            nameEn: this.translateCategoryToEnglish(name),
            slug,
            parentId,
            isActive: true,
            sortOrder: 0,
          },
        });
        createdCategories.add(fullPath);
        this.logger.log(`Created category: ${fullPath} (slug: ${slug})`);
      }

      parentId = category.id;
      // Keep track of root category slug for prefixing
      if (i === 0) {
        parentSlug = baseSlug;
      }
    }
  }

  private async getCategoryByPath(path: string): Promise<{ id: string } | null> {
    const parts = path.split('>').map(p => p.trim());
    let parentId: string | null = null;
    let parentSlug: string | null = null;
    let category: { id: string; slug: string; parentId: string | null } | null = null;

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const baseSlug = this.createSlug(name);
      const slug = parentSlug && i > 0 ? `${parentSlug}-${baseSlug}` : baseSlug;

      category = await this.prisma.category.findFirst({
        where: {
          slug,
          parentId,
        },
        select: {
          id: true,
          slug: true,
          parentId: true,
        },
      });

      if (!category) return null;
      parentId = category.id;
      if (i === 0) {
        parentSlug = baseSlug;
      }
    }

    return category;
  }

  private getParentPath(path: string): string {
    const parts = path.split('>').map(p => p.trim());
    return parts.length > 1 ? parts.slice(0, -1).join(' > ') : parts[0];
  }

  private createSlug(name: string): string {
    // Handle Hebrew names
    const hebrewToSlug: Record<string, string> = {
      'גברים': 'men',
      'נשים': 'women',
      'בגדים': 'clothes',
      'גופייה': 'tank-top',
      'חולצה': 'shirt',
      'חולצות': 'shirts',
      'מכנסיים': 'pants',
      'שמלות': 'dresses',
      'חצאיות': 'skirts',
      'ז\'קטים': 'jackets',
      'סווטשירטים': 'sweatshirts',
      'הודיות': 'hoodies',
      'hoodie': 'hoodies',
    };

    const slug = hebrewToSlug[name];
    if (slug) return slug;

    // Generic slug creation
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0590-\u05FF-]/g, '')
      .substring(0, 50);
  }

  private translateCategoryToEnglish(hebrew: string): string {
    const translations: Record<string, string> = {
      'גברים': 'Men',
      'נשים': 'Women',
      'בגדים': 'Clothes',
      'גופייה': 'Tank Top',
      'חולצה': 'Shirt',
      'חולצות': 'Shirts',
      'מכנסיים': 'Pants',
      'שמלות': 'Dresses',
      'חצאיות': 'Skirts',
      'ז\'קטים': 'Jackets',
      'סווטשירטים': 'Sweatshirts',
      'הודיות': 'Hoodies',
    };

    return translations[hebrew] || hebrew;
  }

  private translateToEnglish(hebrew: string): string {
    // Simple translation - just return Hebrew for now
    // In production, you'd use a translation API
    return hebrew;
  }

  async clearAllProducts(): Promise<void> {
    await this.prisma.product.deleteMany({});
    this.logger.log('Cleared all products');
  }

  async clearAllCategories(): Promise<void> {
    await this.prisma.category.deleteMany({});
    this.logger.log('Cleared all categories');
  }
}
