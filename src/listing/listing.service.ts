import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListingInput } from './dto/create-listing.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UpdateListingInput } from './dto/update-listing.input';

@Injectable()
export class ListingService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  public async create(createListingInput: CreateListingInput) {
    return await this.listingRepository.save(createListingInput);
  }

  public async findAll(
    limit = 20,
    offset = 0,
    where?: FindOptionsWhere<Listing> | FindOptionsWhere<Listing>[],
    active?: boolean,
  ) {
    const baseWhere = Array.isArray(where) ? where : [where ?? {}];
    const mergedWhere = baseWhere.map((condition) => ({
      ...condition,
      ...(active !== undefined && { active }),
    }));
    const [listings, total] = await this.listingRepository.findAndCount({
      where: mergedWhere,
      relations: { user: true },
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
      where: {
        id,
      },
      relations: { user: true },
    });
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
