import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly rewiewRepository: Repository<Review>,
  ) {}

  public async create(createReviewInput: CreateReviewInput): Promise<Review> {
    const review = this.rewiewRepository.create(createReviewInput);
    return await this.rewiewRepository.save(review);
  }

  public async findAll(): Promise<Review[]> {
    return await this.rewiewRepository.find();
  }

  public async findOne(id: string): Promise<Review> {
    const review = await this.rewiewRepository.findOneBy({ id });
    if (!review) {
      throw new NotFoundException(`Отзыв с ID ${id} не найден`);
    }
    return review;
  }

  public async update(
    id: string,
    updateReviewInput: UpdateReviewInput,
  ): Promise<Review> {
    const review = await this.rewiewRepository.findOneBy({ id });
    if (!review) {
      throw new NotFoundException(`Отзыв с ID ${id} не найден`);
    }
    Object.assign(review, updateReviewInput);
    return await this.rewiewRepository.save(review);
  }

  public async remove(id: string): Promise<void> {
    const review = await this.rewiewRepository.findOneBy({ id });
    if (!review) {
      throw new NotFoundException(`Отзыв с ID ${id} не найден`);
    }
    await this.rewiewRepository.delete(id);
  }
}
