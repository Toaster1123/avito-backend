import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from '../listing/entities/listing.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker/locale/ru';
import { Category } from 'src/categories/entities/category.entity';
import { categories } from './constants';

interface CatImage {
  id: string;
  tags: string[];
  mimetype: string;
  createdAt: Date;
}

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
    const usersData = Array(140)
      .fill(null)
      .map(() => {
        return {
          name: faker.name.firstName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          refreshToken: null,
          rating: null,
        };
      });

    const createdUsers = await this.userRepository.save([
      ...usersData,
      {
        name: 'artem',
        email: 'artem@mail.com',
        password: 'password',
        refreshToken: null,
        rating: null,
      },
    ]);

    const listingCount = 172;
    const createdCategory = await this.categoryRepository.save(categories);

    const imagesUrl = `https://cataas.com/api/cats?limit=${listingCount * 10}`;
    const response = await fetch(imagesUrl);
    const imagesArray = (await response.json()) as CatImage[];

    let imageIndex = -1;

    const listingsData = await Promise.all(
      Array(listingCount)
        .fill(null)
        .map(() => {
          const categoryRelations =
            createdCategory[Math.floor(Math.random() * createdCategory.length)];
          const userRelations =
            createdUsers[Math.floor(Math.random() * createdUsers.length)];

          const sortedImages = Array(Math.floor(Math.random() * (10 - 1) + 1))
            .fill(null)
            .map(() => {
              while (
                imageIndex < imagesArray.length - 1 &&
                imagesArray[imageIndex + 1]?.mimetype !== 'image/jpeg' &&
                imagesArray[imageIndex + 1]?.mimetype !== 'image/png'
              ) {
                imageIndex++;
              }
              if (imageIndex < imagesArray.length - 1) {
                imageIndex++;
                return `https://cataas.com/cat/${imagesArray[imageIndex].id}`;
              }
              return null;
            })
            .filter((item) => item !== null);

          return {
            name: faker.commerce.productName(),
            price: Math.floor(
              parseFloat(faker.commerce.price({ min: 200, max: 44000 })),
            ),
            description: faker.lorem.paragraph(),
            images: sortedImages,
            userId: userRelations.id,
            user: userRelations,
            city: faker.location.city(),
            categoryId: categoryRelations.id,
            category: categoryRelations,
          };
        }),
    );

    await this.listingRepository.save(listingsData);
  }

  private async clearListings() {
    await this.listingRepository.query('TRUNCATE TABLE "listing" CASCADE');
    await this.userRepository.query('TRUNCATE TABLE "user" CASCADE');
    await this.categoryRepository.query('TRUNCATE TABLE "category" CASCADE');
  }
}
