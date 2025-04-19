import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async updateUserRating(userId: string): Promise<void> {
    const reviews = await this.reviewRepository.find({
      where: { recipient: { id: userId } },
    });

    if (reviews.length === 0) return;

    const avgRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await this.reviewRepository.manager.getRepository(User).update(userId, {
      rating: parseFloat(avgRating.toFixed(2)),
    });
  }

  public async create(createReviewInput: CreateReviewInput): Promise<Review> {
    const review = this.reviewRepository.create(createReviewInput);
    const savedReview = await this.reviewRepository.save(review);

    await this.updateUserRating(createReviewInput.recipientId);

    return savedReview;
  }

  public async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find({
      relations: ['recipient', 'sender', 'listing'],
    });
  }

  public async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['recipient', 'sender', 'listing'],
    });
    if (!review) {
      throw new NotFoundException(`Отзыв с ID ${id} не найден`);
    }
    return review;
  }

  public async update(
    id: string,
    updateReviewInput: UpdateReviewInput,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOneBy({ id });
    if (!review) {
      throw new NotFoundException(`Отзыв с ID ${id} не найден`);
    }

    Object.assign(review, updateReviewInput);
    const updated = await this.reviewRepository.save(review);

    if (updateReviewInput.recipientId) {
      await this.updateUserRating(updateReviewInput.recipientId);
    }

    return updated;
  }

  public async remove(id: string): Promise<void> {
    const review = await this.reviewRepository.findOneBy({ id });
    if (!review) {
      throw new NotFoundException(`Отзыв с ID ${id} не найден`);
    }
    await this.reviewRepository.delete(id);

    if (review.recipient?.id) {
      await this.updateUserRating(review.recipient.id);
    }
  }
}
