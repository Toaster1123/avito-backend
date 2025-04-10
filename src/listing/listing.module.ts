import { Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingResolver } from './listing.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Listing])],
  providers: [ListingResolver, ListingService],
})
export class ListingModule {}
