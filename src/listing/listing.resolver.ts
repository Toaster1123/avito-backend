import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { ListingService } from './listing.service';
import { Listing } from './entities/listing.entity';
import { CreateListingInput } from './dto/create-listing.input';
import { User } from 'src/user/entities/user.entity';

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

  @ResolveField(() => Listing, { name: 'getUserListings' })
  getUserListings(@Parent() user: User) {
    return this.listingService.findAll({ userId: user.id });
  }

  @Query(() => Listing, { name: 'findOneListing' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.listingService.findOne(id);
  }
}
