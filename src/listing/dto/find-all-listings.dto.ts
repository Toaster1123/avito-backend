import { FindOptionsWhere } from 'typeorm';
import { Listing } from '../entities/listing.entity';

export class FindListingDto {
  limit?: number = 20;
  offset?: number = 0;
  categoryId?: string;
  active?: boolean;
  where?: FindOptionsWhere<Listing> | FindOptionsWhere<Listing[]>;
}
