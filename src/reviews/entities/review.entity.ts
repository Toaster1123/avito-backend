import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Listing } from 'src/listing/entities/listing.entity';

@ObjectType()
@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'ID отзыва' })
  id: string;

  @ManyToOne(() => User, (user) => user.receivedReviews, {
    onDelete: 'CASCADE',
  })
  @Field(() => User, { description: 'Пользователь, который получил отзыв' })
  recipient: User;

  @ManyToOne(() => User, (user) => user.sentReviews, { onDelete: 'CASCADE' })
  @Field(() => User, { description: 'Пользователь, который оставил отзыв' })
  sender: User;

  @ManyToOne(() => Listing)
  @Field(() => Listing, {
    description: 'Объявление, к которому относится отзыв',
  })
  listing: Listing;

  @Column({ type: 'uuid', nullable: true })
  @Field(() => String, { nullable: true, description: 'ID объявления' })
  listingId?: string;

  @Column({ type: 'int', default: 5 })
  @Field(() => Number, { description: 'Оценка от 1 до 5' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true, description: 'Текст отзыва' })
  comment: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date, { description: 'Дата создания отзыва' })
  createdAt: Date;
}
