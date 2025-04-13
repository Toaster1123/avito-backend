import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Listing } from 'src/listing/entities/listing.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'ID категории' })
  id: string;

  @Column({ type: 'text' })
  @Field(() => String, { description: 'Название категории' })
  name: string;

  @Column({ type: 'text', unique: true, nullable: true })
  @Field(() => String, {
    description: 'Родительская категория',
    nullable: true,
  })
  parentId: string | null;

  @OneToMany(() => Listing, (listing) => listing.category)
  @Field(() => [Listing], { description: 'Объявления в категории' })
  listings: Promise<Listing[]>;
}
