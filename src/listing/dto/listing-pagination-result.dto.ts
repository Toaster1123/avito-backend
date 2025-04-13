import { ObjectType, Field } from '@nestjs/graphql';
import { Listing } from '../entities/listing.entity';

@ObjectType()
export class ListingPaginationResult {
  @Field(() => [Listing])
  listings: Listing[];

  @Field(() => Boolean)
  hasMore: boolean;
}
