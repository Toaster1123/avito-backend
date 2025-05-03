import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListingInput } from './dto/create-listing.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { FindOptionsWhere, Repository, TreeRepository } from 'typeorm';
import { UpdateListingInput } from './dto/update-listing.input';
import { Category } from 'src/categories/entities/category.entity';
import { FindListingDto } from './dto/find-all-listings.dto';

@Injectable()
export class ListingService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(Category)
    private readonly categoryRepository: TreeRepository<Category>,
  ) {}

  public async create(createListingInput: CreateListingInput) {
    return await this.listingRepository.save(createListingInput);
  }

  // public async findAll(
  //   limit = 20,
  //   offset = 0,
  //   where?: FindOptionsWhere<Listing> | FindOptionsWhere<Listing>[],
  //   active?: boolean,
  // ) {
  //   const baseWhere = Array.isArray(where) ? where : [where ?? {}];
  //   const mergedWhere = baseWhere.map((condition) => ({
  //     ...condition,
  //     ...(active !== undefined && { active }),
  //   }));
  //   const [listings, total] = await this.listingRepository.findAndCount({
  //     where: mergedWhere,
  //     relations: { user: true, category: true },
  //     take: limit,
  //     skip: offset,
  //     order: { createdAt: 'DESC' },
  //   });
  //   return {
  //     listings,
  //     hasMore: offset + limit < total,
  //   };
  // }
  public async findAll(dto: FindListingDto) {
    const { active, categoryId, limit = 20, offset = 0, where } = dto;

    const baseWhere = (Array.isArray(where) ? where : [where]).filter(
      (w): w is FindOptionsWhere<Listing> => Boolean(w),
    );

    let finalWhere: FindOptionsWhere<Listing>[] = [...baseWhere];

    if (categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: categoryId,
      });

      if (!category) {
        throw new NotFoundException(`Категория с ID ${categoryId} не найдена`);
      }

      const descendants =
        await this.categoryRepository.findDescendants(category);
      const categoryIds = descendants.map((cat) => cat.id);

      const whereConditions = categoryIds.map((id) => ({
        category: { id },
        ...(active !== undefined ? { active } : {}),
      }));

      finalWhere =
        finalWhere.length === 0
          ? whereConditions
          : finalWhere.flatMap((cond) =>
              whereConditions.map((whereCond) => ({ ...cond, ...whereCond })),
            );
    } else if (active !== undefined) {
      finalWhere = finalWhere.map((w) => ({ ...w, active }));
    }

    const [listings, total] = await this.listingRepository.findAndCount({
      where: finalWhere,
      relations: { user: true, category: true },
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    return {
      listings,
      hasMore: offset + limit < total,
    };
  }

  public async findOne(id: string) {
    return await this.listingRepository.findOne({
      where: { id },
      relations: [
        'user',
        'user.listings',
        'user.receivedReviews',
        'reviews',
        'category',
      ],
    });
  }

  public async getListingBreadcrumb(category: Category): Promise<Category[]> {
    const ancestors = await this.categoryRepository.findAncestors(category);
    console.log(ancestors);
    return ancestors;
  }

  public async getCategoryIdsWithDescendants(
    categoryId: string,
  ): Promise<string[]> {
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) {
      throw new NotFoundException(`Категория с ID ${categoryId} не найдена`);
    }

    const descendants = await this.categoryRepository.findDescendants(category);

    return descendants.map((cat) => cat.id);
  }

  async updateActiveStatus(
    id: string,
    active: boolean = false,
  ): Promise<Listing> {
    const listing = await this.listingRepository.findOneBy({ id });
    if (!listing) {
      throw new NotFoundException(`Объявление с ID ${id} не найдено`);
    }
    listing.active = active;
    return this.listingRepository.save(listing);
  }

  public async update(
    id: string,
    updateListingInput: UpdateListingInput,
  ): Promise<Listing> {
    const listing = await this.listingRepository.findOneBy({ id });
    if (!listing) {
      throw new NotFoundException(`Обьявление с ID ${id} не найден`);
    }
    Object.assign(listing, updateListingInput);

    return this.listingRepository.save(listing);
  }

  public async remove(id: string): Promise<void> {
    const listing = await this.listingRepository.findOneBy({ id });
    if (!listing) {
      throw new NotFoundException(`Обьявление с ID ${id} не найден`);
    }

    await this.listingRepository.delete(id);
  }
}
