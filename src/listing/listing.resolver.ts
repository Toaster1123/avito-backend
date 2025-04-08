import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ListingService } from './listing.service';
import { Listing } from './entities/listing.entity';
import { CreateListingInput } from './dto/create-listing.input';
import { UpdateListingInput } from './dto/update-listing.input';

@Resolver(() => Listing)
export class ListingResolver {
  constructor(private readonly listingService: ListingService) {}

  @Mutation(() => Listing)
  createListing(
    @Args('createListingInput') createListingInput: CreateListingInput,
  ) {
    return this.listingService.create(createListingInput);
  }

  @Query(() => [Listing], { name: 'listing' })
  findAll() {
    return this.listingService.findAll();
  }

  @Query(() => Listing, { name: 'listing' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.listingService.findOne(id);
  }

  @Mutation(() => Listing)
  updateListing(
    @Args('updateListingInput') updateListingInput: UpdateListingInput,
  ) {
    return this.listingService.update(
      updateListingInput.id,
      updateListingInput,
    );
  }

  @Mutation(() => Listing)
  removeListing(@Args('id', { type: () => Int }) id: number) {
    return this.listingService.remove(id);
  }
}
