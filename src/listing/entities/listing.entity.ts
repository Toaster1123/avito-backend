import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Listing {
  @Field({ description: 'Название объявления' })
  name: string;

  @Field(() => Int, { description: 'Цена объявления' })
  price: number;

  @Field({ description: 'Описание объявления' })
  description: string;

  @Field(() => [String], { description: 'Изображения объявления' })
  image: string[];
}
