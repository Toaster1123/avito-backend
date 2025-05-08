import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: TreeRepository<Category>,
  ) {}

  public async create(
    createCategoryInput: CreateCategoryInput,
  ): Promise<Category> {
    const { name, parentId } = createCategoryInput;

    let parent: Category | null = null;

    if (parentId) {
      parent = await this.categoryRepository.findOneBy({ id: parentId });
      if (!parent) {
        throw new Error('Parent category not found');
      }
    }

    const category = this.categoryRepository.create({
      name,
      parent,
    });

    return await this.categoryRepository.save(category);
  }

  public async findAllWithRelations(): Promise<Category[]> {
    const categories = await this.categoryRepository.find();

    return this.buildTree(categories);
  }

  public buildTree(categories: Category[]): Category[] {
    const categoryMap = new Map<string, Category>();
    const tree: Category[] = [];

    categories.forEach((category) => {
      category.children = [];
      categoryMap.set(category.id, category);
    });

    categories.forEach((category) => {
      if (!category.parentId) {
        tree.push(category);
      } else {
        const parent = categoryMap.get(category.parentId);
        if (parent && parent.children) {
          parent.children.push(category);
        }
      }
    });

    return tree;
  }
  public async findOne(id: string): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
  }

  public async getListingBreadcrumb(categoryId: string): Promise<Category[]> {
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) {
      throw new NotFoundException(`Категория с ID ${categoryId} не найдена`);
    }
    const ancestors = await this.categoryRepository.findAncestors(category);
    return ancestors;
  }
}
