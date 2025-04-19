import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from '../listing/entities/listing.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker/locale/ru';
import { Category } from 'src/categories/entities/category.entity';
import { categories } from './constants';
import { Review } from 'src/reviews/entities/review.entity';

interface CatImage {
  id: string;
  tags: string[];
  mimetype: string;
  createdAt: Date;
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
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
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  public async run() {
    await this.clearListings();

    const listingCount = 243;
    const createdUserLength = 140;
    let imageIndex = -1;

    // Создание пользователей
    const usersData = Array(createdUserLength)
      .fill(null)
      .map(() => ({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        refreshToken: null,
        rating: null,
      }));

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

    // Создание категорий
    const createdCategory = await this.categoryRepository.save(categories);

    // Получение изображений
    const imagesUrl = `https://cataas.com/api/cats?limit=${listingCount * 10}`;
    const response = await fetch(imagesUrl);
    const imagesArray = (await response.json()) as CatImage[];

    // Создание объявлений
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
            active: Math.random() > 0.8,
          };
        }),
    );
    const createdListings = await this.listingRepository.save(listingsData);

    // Создание отзывов
    const reviews = Array(94)
      .fill(null)
      .map(() => {
        const listing =
          createdListings[Math.floor(Math.random() * createdListings.length)];

        const recipient = listing.user;

        let senderId = Math.floor(Math.random() * createdUsers.length);
        while (createdUsers[senderId].id === recipient.id) {
          senderId = Math.floor(Math.random() * createdUsers.length);
        }
        const sender = createdUsers[senderId];

        return {
          recipient,
          sender,
          rating: Math.floor(Math.random() * 5 + 1),
          comment: faker.lorem.sentence({ min: 1, max: 30 }),
          listing,
          listingId: listing.id,
        };
      });

    await this.reviewRepository.save(reviews);

    // Обновление рейтингов пользователей и даты создания
    for (const user of createdUsers) {
      const received = reviews.filter(
        (review) => review.recipient.id === user.id,
      );
      if (received.length > 0) {
        const avgRating =
          received.reduce((acc, review) => acc + review.rating, 0) /
          received.length;

        await this.userRepository.update(user.id, {
          rating: parseFloat(avgRating.toFixed(2)),
        });

        const randomDate = getRandomDate(new Date('2013-01-01'), new Date());
        await this.userRepository.update(user.id, {
          createdAt: randomDate,
        });
      }
    }
  }

  private async clearListings() {
    await this.reviewRepository.query('TRUNCATE TABLE "review" CASCADE');
    await this.listingRepository.query('TRUNCATE TABLE "listing" CASCADE');
    await this.userRepository.query('TRUNCATE TABLE "user" CASCADE');
    await this.categoryRepository.query('TRUNCATE TABLE "category" CASCADE');
  }
}
