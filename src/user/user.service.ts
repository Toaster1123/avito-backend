import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateReviewInput } from 'src/reviews/dto/create-review.input';
import { Review } from 'src/reviews/entities/review.entity';
import { ReviewsService } from 'src/reviews/reviews.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly reviewsService: ReviewsService,
  ) {}

  public async create(createUserInput: CreateUserInput) {
    return await this.userRepository.save(createUserInput);
  }

  public async findAll() {
    return await this.userRepository.find({
      relations: { listings: true },
    });
  }

  public async findOne(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: { listings: true },
    });
  }

  public async addReview(
    userId: string,
    createReviewInput: CreateReviewInput,
  ): Promise<Review> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }
    createReviewInput.recipientId = userId;
    return this.reviewsService.create(createReviewInput);
  }

  public async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  public async update(updateUserInput: UpdateUserInput) {
    return await this.userRepository.update(
      updateUserInput.id,
      updateUserInput,
    );
  }
}
