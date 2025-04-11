import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from '../listing/entities/listing.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Listing, User])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
