import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
  ID,
  Int,
} from '@nestjs/graphql';
import { ListingService } from './listing.service';
import { Listing } from './entities/listing.entity';
import { CreateListingInput } from './dto/create-listing.input';
import { User } from 'src/user/entities/user.entity';
import { ListingPaginationResult } from './dto/listing-pagination-result.dto';
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

  @Query(() => ListingPaginationResult, { name: 'findAllListings' })
  findAllListings(
    @Args('limit', { type: () => Int, nullable: true }) limit = 20,
    @Args('offset', { type: () => Int, nullable: true }) offset = 0,
    @Args('active', { nullable: true, type: () => Boolean }) active?: boolean,
  ) {
    return this.listingService.findAll(limit, offset, undefined, active);
  }

  @ResolveField(() => ListingPaginationResult, { name: 'getUserListings' })
  getUserListings(
    @Parent() user: User,
    @Args('limit', { type: () => Int, nullable: true }) limit = 20,
    @Args('offset', { type: () => Int, nullable: true }) offset = 0,
  ) {
    return this.listingService.findAll(limit, offset, {
      user: { id: user.id },
    });
  }

  @Query(() => Listing, { name: 'findOneListing' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.listingService.findOne(id);
  }

  @Mutation(() => Listing)
  updateListingActiveStatus(
    @Args('updateListingActiveInput')
    updateListingActiveInput: UpdateListingInput,
  ) {
    return this.listingService.updateActiveStatus(
      updateListingActiveInput.id,
      updateListingActiveInput.active,
    );
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

  @Mutation(() => Boolean)
  async removeListing(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.listingService.remove(id);
    return true;
  }
}
