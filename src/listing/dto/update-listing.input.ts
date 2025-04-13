import { CreateListingInput } from './create-listing.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateListingInput extends PartialType(CreateListingInput) {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true, description: 'Активно ли объявление' })
  active?: boolean;
}
