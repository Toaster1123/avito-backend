import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateListingInput {
  @Field({ description: 'Название объявления' })
  name: string;

  @Field(() => Int, { description: 'Цена объявления' })
  price: number;

  @Field({ description: 'Описание объявления' })
  description: string;

  @Field(() => [String], { description: 'Изображения объявления' })
  images: string[];
}
