import { Injectable } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  public async create(createCategoryInput: CreateCategoryInput) {
    return await this.categoryRepository.save(createCategoryInput);
  }

  public async findAll() {
    return this.categoryRepository.find();
  }

  public async findOne(id: string) {
    return this.categoryRepository.findBy({ id });
  }
}
