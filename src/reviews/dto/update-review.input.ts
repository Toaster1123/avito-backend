import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateReviewInput } from './create-review.input';

@InputType()
export class UpdateReviewInput extends PartialType(CreateReviewInput) {
  @Field(() => String, { description: 'ID отзыва' })
  id: string;
}
