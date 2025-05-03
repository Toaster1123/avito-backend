import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Category } from 'src/categories/entities/category.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Название объявления' })
  id: string;

  @Column()
  @Field({ description: 'Название объявления' })
  name: string;

  @Column()
  @Field(() => Int, { description: 'Цена объявления' })
  price: number;

  @Column()
  @Field({ description: 'Описание объявления' })
  description: string;

  @Column('text', { array: true })
  @Field(() => [String], { description: 'Изображения объявления' })
  images: string[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.listings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  @Field({ description: 'ID автора' })
  userId: string;

  @Column({ default: true })
  @Field({ description: 'Активно ли объявление' })
  active: boolean;

  @Field(() => Category, {
    description: 'Категория объявления',
  })
  @ManyToOne(() => Category, (category) => category.listings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: 'uuid' })
  @Field({ description: 'ID категории' })
  categoryId: string;

  @Column()
  @Field({ description: 'Город' })
  city: string;

  @OneToMany(() => Review, (review) => review.listing)
  @Field(() => [Review], { nullable: true, description: 'Отзывы к объявлению' })
  reviews?: Review[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field({ description: 'Дата создания объявления' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field({ description: 'Дата последнего обновления объявления' })
  updatedAt: Date;
}
