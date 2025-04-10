import { Injectable } from '@nestjs/common';
import { CreateListingInput } from './dto/create-listing.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

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
    where?: FindOptionsWhere<Listing> | FindOptionsWhere<Listing>[],
  ) {
    return await this.listingRepository.find({ where });
  }

  public async findOne(id: string) {
    return await this.listingRepository.findOne({
      where: {
        id,
      },
    });
  }
}
