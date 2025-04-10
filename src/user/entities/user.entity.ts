import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'ID пользователя' })
  id: string;

  @Column({ default: 'User' })
  @Field({ description: 'Имя пользователя' })
  name: string;

  @Column()
  @Field({ description: 'Email пользователя' })
  email: string;

  @Column()
  @Field({ description: 'Password пользователя' })
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field({ description: 'Дата создания пользователя' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field({ description: 'Дата последнего обновления пользователя' })
  updatedAt: Date;
}
