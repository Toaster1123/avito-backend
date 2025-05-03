import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../listing/entities/listing.entity';
import { User } from '../user/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { categories } from './constants';
import { faker } from '@faker-js/faker/locale/ru';
import { getRandomDate } from './seed-functions';

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
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async run() {
    await this.clearData();

    const createdUserLength = 512;
    const listingCount = 1024;
    let imageIndex = -1;
    const maxImageIndex = 1900;

    // Создание пользователей
    const usersData = Array.from({ length: createdUserLength }).map(() => ({
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

    // Рекурсивное создание категорий
    await this.saveCategoryTree(categories as Partial<Category>[], null);

    const categoryTree = await this.categoryRepository.find({
      relations: ['children'],
    });

    const leafCategories = this.getLeafCategories(categoryTree);

    // Получение изображений
    const imagesUrl = `https://cataas.com/api/cats?limit=${maxImageIndex}`;
    const response = await fetch(imagesUrl);
    const imagesArray = (await response.json()) as CatImage[];

    // Создание объявлений
    const listingsData = await Promise.all(
      Array.from({ length: listingCount }).map(() => {
        const category =
          leafCategories[Math.floor(Math.random() * leafCategories.length)];
        const user =
          createdUsers[Math.floor(Math.random() * createdUsers.length)];

        const sortedImages = Array(Math.floor(Math.random() * (10 - 1) + 1))
          .fill(null)
          .map(() => {
            while (
              imagesArray[imageIndex + 1]?.mimetype !== 'image/jpeg' &&
              imagesArray[imageIndex + 1]?.mimetype !== 'image/png'
            ) {
              if (imageIndex >= maxImageIndex) {
                imageIndex = -1;
              }
              imageIndex++;
            }

            if (imageIndex >= maxImageIndex) {
              imageIndex = -1;
            }
            imageIndex++;
            return `https://cataas.com/cat/${imagesArray[imageIndex].id}`;
          })
          .filter((item): item is string => item !== null);

        return {
          name: faker.commerce.productName(),
          price: Math.floor(
            parseFloat(faker.commerce.price({ min: 200, max: 44000 })),
          ),
          description: faker.lorem.paragraph(),
          images: sortedImages,
          userId: user.id,
          user,
          city: faker.location.city() + ', ' + faker.location.streetAddress(),
          categoryId: category.id,
          category,
          active: Math.random() > 0.8,
        };
      }),
    );

    const createdListings = await this.listingRepository.save(listingsData);

    // Создание отзывов
    const reviews = Array.from({ length: 94 }).map(() => {
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

    // Обновление рейтинга и даты создания пользователей
    for (const user of createdUsers) {
      const received = reviews.filter(
        (review) => review.recipient.id === user.id,
      );
      if (received.length > 0) {
        const avgRating =
          received.reduce((acc, r) => acc + r.rating, 0) / received.length;

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

  private async clearData() {
    await this.reviewRepository.query('TRUNCATE TABLE "review" CASCADE');
    await this.listingRepository.query('TRUNCATE TABLE "listing" CASCADE');
    await this.userRepository.query('TRUNCATE TABLE "user" CASCADE');
    await this.categoryRepository.query('TRUNCATE TABLE "category" CASCADE');
  }

  private async saveCategoryTree(
    categories: Partial<Category>[],
    parent: Category | null,
  ) {
    for (const category of categories) {
      const { children, ...rest } = category;
      const entity = this.categoryRepository.create({ ...rest, parent });
      const saved = await this.categoryRepository.save(entity);

      if (children && children.length > 0) {
        await this.saveCategoryTree(children, saved);
      }
    }
  }

  private getLeafCategories(categories: Category[]): Category[] {
    const leafs: Category[] = [];

    const traverse = (nodes: Category[] | null) => {
      if (!nodes) return;
      for (const node of nodes) {
        if (node.children?.length === 0) {
          leafs.push(node);
        } else {
          traverse(node.children);
        }
      }
    };

    traverse(categories);
    return leafs;
  }
}
