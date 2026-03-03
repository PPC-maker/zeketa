import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(options?: {
    category?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }) {
    const { category, type, limit = 50, offset = 0 } = options || {};

    const where: any = {
      isActive: true,
    };

    if (category) {
      // Find the category by slug
      const categoryRecord = await this.prisma.category.findFirst({
        where: { slug: category },
      });

      if (categoryRecord) {
        // Get all child category IDs (for hierarchical categories)
        const childCategories = await this.prisma.category.findMany({
          where: { parentId: categoryRecord.id },
          select: { id: true, slug: true },
        });

        // Get grandchild categories too
        const grandchildCategories = await this.prisma.category.findMany({
          where: { parentId: { in: childCategories.map(c => c.id) } },
          select: { id: true, slug: true },
        });

        // If type is specified, filter by subcategory slug
        if (type) {
          // Map type to expected slug format
          const typeMapping: Record<string, string> = {
            'shirts': 'shirts',
            'tank-top': 'tank-top',
            'hoodies': 'hoodies',
            'pants': 'pants',
          };
          const mappedType = typeMapping[type] || type;

          const matchingSubcategory = [...childCategories, ...grandchildCategories].find(
            c => c.slug === mappedType ||
                 c.slug === `${category}-${mappedType}` ||
                 c.slug.endsWith(`-${mappedType}`)
          );
          if (matchingSubcategory) {
            where.categoryId = matchingSubcategory.id;
          } else {
            // If no matching subcategory, filter by tags
            where.tags = { has: type };
          }
        } else {
          const allCategoryIds = [
            categoryRecord.id,
            ...childCategories.map(c => c.id),
            ...grandchildCategories.map(c => c.id),
          ];
          where.categoryId = { in: allCategoryIds };
        }
      }
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map((p) => ({
        id: p.id,
        sku: p.sku,
        nameHe: p.nameHe,
        nameEn: p.nameEn,
        descHe: p.descHe,
        descEn: p.descEn,
        priceUsd: Number(p.priceUsd),
        priceIls: Number(p.priceIls),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        images: p.images,
        sizes: p.sizes,
        colors: p.colors,
        tags: p.tags,
        isNew: p.isNew,
        isBestSeller: p.isBestSeller,
        isFeatured: p.isFeatured,
        stock: p.stock,
        category: p.category,
      })),
      total,
      limit,
      offset,
    };
  }

  async findByCategory(categorySlug: string, type?: string) {
    return this.findAll({ category: categorySlug, type });
  }

  async getCategories() {
    // Get top-level categories (men, women) with their children
    const categories = await this.prisma.category.findMany({
      where: {
        isActive: true,
        parentId: null, // Only top-level
      },
      include: {
        children: {
          where: { isActive: true },
          include: {
            children: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return categories;
  }

  async getCategoryTree() {
    // Return full category tree for navigation
    return this.prisma.category.findMany({
      where: {
        isActive: true,
        parentId: null,
      },
      include: {
        children: {
          where: { isActive: true },
          include: {
            children: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createCategory(data: {
    nameHe: string;
    nameEn: string;
    slug: string;
    parentId?: string | null;
    image?: string;
    sortOrder?: number;
  }) {
    return this.prisma.category.create({
      data: {
        nameHe: data.nameHe,
        nameEn: data.nameEn,
        slug: data.slug,
        parentId: data.parentId || null,
        image: data.image,
        sortOrder: data.sortOrder || 0,
      },
    });
  }

  async updateCategory(
    id: string,
    data: {
      nameHe?: string;
      nameEn?: string;
      slug?: string;
      parentId?: string | null;
      image?: string;
      sortOrder?: number;
      isActive?: boolean;
    },
  ) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: string) {
    // First check if category has products
    const productsCount = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      throw new Error(`Cannot delete category with ${productsCount} products`);
    }

    // Check if category has children
    const childrenCount = await this.prisma.category.count({
      where: { parentId: id },
    });

    if (childrenCount > 0) {
      throw new Error(`Cannot delete category with ${childrenCount} child categories`);
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }

  async getProductsByGender(gender: 'men' | 'women', limit = 50) {
    // Find products that have the gender tag
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { tags: { has: gender } },
          { tags: { has: 'unisex' } },
        ],
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });

    return {
      products: products.map((p) => ({
        id: p.id,
        sku: p.sku,
        nameHe: p.nameHe,
        nameEn: p.nameEn,
        priceUsd: Number(p.priceUsd),
        priceIls: Number(p.priceIls),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        images: p.images,
        sizes: p.sizes,
        tags: p.tags,
        isNew: p.isNew,
        isBestSeller: p.isBestSeller,
        category: p.category,
      })),
      total: products.length,
    };
  }

  async getNewProducts(limit = 50) {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        isNew: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });

    return {
      products: products.map((p) => ({
        id: p.id,
        sku: p.sku,
        nameHe: p.nameHe,
        nameEn: p.nameEn,
        priceUsd: Number(p.priceUsd),
        priceIls: Number(p.priceIls),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        images: p.images,
        isNew: p.isNew,
        isBestSeller: p.isBestSeller,
      })),
      total: products.length,
    };
  }

  async getBestSellers(limit = 50) {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        isBestSeller: true,
      },
      take: limit,
      orderBy: { soldCount: 'desc' },
      include: { category: true },
    });

    return {
      products: products.map((p) => ({
        id: p.id,
        sku: p.sku,
        nameHe: p.nameHe,
        nameEn: p.nameEn,
        priceUsd: Number(p.priceUsd),
        priceIls: Number(p.priceIls),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        images: p.images,
        isNew: p.isNew,
        isBestSeller: p.isBestSeller,
      })),
      total: products.length,
    };
  }

  async findOne(id: string) {
    // Try to find by ID first, then by SKU
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { sku: id },
        ],
      },
      include: { category: true },
    });

    if (!product) {
      return null;
    }

    return {
      id: product.id,
      sku: product.sku,
      name_he: product.nameHe,
      name_en: product.nameEn,
      desc_he: product.descHe,
      desc_en: product.descEn,
      price_usd: Number(product.priceUsd),
      price_ils: Number(product.priceIls),
      sale_price: product.salePrice ? Number(product.salePrice) : null,
      images: product.images,
      sizes: product.sizes,
      colors: product.colors,
      tags: product.tags,
      stock: product.stock,
      is_new: product.isNew,
      is_best_seller: product.isBestSeller,
      is_featured: product.isFeatured,
      is_active: product.isActive,
      category: product.category,
    };
  }
}
