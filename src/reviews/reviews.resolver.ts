import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Mutation(() => Review, { name: 'createReview' })
  async createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
  ): Promise<Review> {
    return this.reviewsService.create(createReviewInput);
  }

  @Query(() => [Review], { name: 'reviews', nullable: true })
  async findAll(): Promise<Review[]> {
    return this.reviewsService.findAll();
  }

  @Query(() => Review, { name: 'review', nullable: true })
  async findOne(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Review> {
    return this.reviewsService.findOne(id);
  }

  @Mutation(() => Review, { name: 'updateReview' })
  async updateReview(
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
  ): Promise<Review> {
    return this.reviewsService.update(updateReviewInput.id, updateReviewInput);
  }

  @Mutation(() => Review, { name: 'removeReview' })
  async removeReview(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Review> {
    const review = await this.reviewsService.findOne(id);
    await this.reviewsService.remove(id);
    return review;
  }
}
