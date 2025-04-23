import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Listing } from 'src/listing/entities/listing.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'ID категории' })
  id: string;

  @Column({ type: 'text' })
  @Field(() => String, { description: 'Название категории' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, {
    description: 'Родительская категория',
    nullable: true,
  })
  parentId: string | null;

  @ManyToOne(() => Category, (category) => category.id, { nullable: true })
  @Field(() => Category, {
    nullable: true,
    description: 'Родительская категория',
  })
  parent: Category;

  @OneToMany(() => Listing, (listing) => listing.category)
  @Field(() => [Listing], { description: 'Объявления в категории' })
  listings: Promise<Listing[]>;
}
