import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ListingService } from './listing.service';
import { Listing } from './entities/listing.entity';
import { CreateListingInput } from './dto/create-listing.input';

@Resolver(() => Listing)
export class ListingResolver {
  constructor(private readonly listingService: ListingService) {}

  @Mutation(() => Listing)
  createListing(
    @Args('createListingInput') createListingInput: CreateListingInput,
  ) {
    return this.listingService.create(createListingInput);
  }

  @Query(() => [Listing], { name: 'findAllListings' })
  findAll() {
    return this.listingService.findAll();
  }

  @Query(() => Listing, { name: 'findOneListing' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.listingService.findOne(id);
  }
}
