import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
  @Field(() => String, { description: 'Название категории' })
  name: string;

  @Field(() => String, {
    description: 'Родительская категория',
    nullable: true,
  })
  parentId: string | null;
}
