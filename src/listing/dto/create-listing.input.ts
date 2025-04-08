import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateListingInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
