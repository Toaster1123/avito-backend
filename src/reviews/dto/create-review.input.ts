import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field(() => String, {
    description: 'ID пользователя, который получил отзыв',
  })
  recipientId: string;

  @Field(() => String, {
    description: 'ID пользователя, который оставил отзыв',
  })
  senderId: string;

  @Field(() => Int, { description: 'Оценка от 1 до 5' })
  rating: number;

  @Field(() => String, { nullable: true, description: 'Текст отзыва' })
  comment?: string;
}
