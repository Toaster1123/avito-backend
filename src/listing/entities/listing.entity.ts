import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
