import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Listing } from 'src/listing/entities/listing.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@ObjectType()
@Entity()
@Tree('closure-table')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'ID категории' })
  id: string;

  @Column({ type: 'text' })
  @Field(() => String, { description: 'Название категории' })
  name: string;

  @TreeParent()
  @Field(() => Category, {
    nullable: true,
    description: 'Родительская категория',
  })
  parent: Category | null;

  @Column({ type: 'uuid', nullable: true })
  @Field(() => ID, { nullable: true, description: 'ID родительской категории' })
  parentId: string | null;

  @TreeChildren()
  @Field(() => [Category], {
    nullable: true,
    description: 'Дочерние категории',
  })
  children: Category[] | null;

  @OneToMany(() => Listing, (listing) => listing.category)
  @Field(() => [Listing], { description: 'Объявления в категории' })
  listings: Listing[];
}
