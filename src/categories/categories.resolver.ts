import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  ID,
} from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => Category)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoriesService.create(createCategoryInput);
  }

  @Query(() => [Category], { name: 'findAllCategories' })
  findAll() {
    return this.categoriesService.findAllWithRelations();
  }

  @Query(() => Category, { name: 'findOneCategory' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.categoriesService.findOne(id);
  }

  @ResolveField(() => Category, { nullable: true })
  async parent(@Parent() category: Category) {
    if (!category.parent?.id) {
      return null;
    }
    return this.categoriesService.findOne(category.parent.id);
  }
}
