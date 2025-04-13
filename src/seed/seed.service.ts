import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from '../listing/entities/listing.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker/locale/ru';
import { Category } from 'src/categories/entities/category.entity';
import { categories } from './constants';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Listing)
    private listingRepository: Repository<Listing>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  public async run() {
    await this.clearListings();

    const createdUser = await this.userRepository.save({
      name: 'artem',
      email: 'artem@mail.com',
      password: 'password',
      refreshToken: null,
      rating: null,
    });

    const createdCategory = await this.categoryRepository.save(categories);
    const listingsData = Array(40)
      .fill(null)
      .map(() => {
        const categoryRelations =
          createdCategory[Math.floor(Math.random() * createdCategory.length)];
        return {
          name: faker.commerce.productName(),
          price: Math.floor(
            parseFloat(faker.commerce.price({ min: 200, max: 43000 })),
          ),
          description: faker.lorem.paragraph(),
          images: [faker.image.url(), faker.image.url()],
          userId: createdUser.id,
          user: createdUser,
          categoryId: categoryRelations.id,
          category: categoryRelations,
        };
      });

    await this.listingRepository.save(listingsData);
  }

  private async clearListings() {
    await this.listingRepository.query('TRUNCATE TABLE "listing" CASCADE');
    await this.userRepository.query('TRUNCATE TABLE "user" CASCADE');
    await this.categoryRepository.query('TRUNCATE TABLE "category" CASCADE');
  }
}
