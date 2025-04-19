import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Dialog } from 'src/dialogs/entities/dialog.entity';
import { Listing } from 'src/listing/entities/listing.entity';
import { Message } from 'src/messages/entities/message.entity';
import { Review } from 'src/reviews/entities/review.entity';
import {
  Column,
  Entity,
  OneToMany,
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

  @Column({ type: 'decimal', precision: 3, scale: 2, default: null })
  @Field(() => Number, { description: 'Оценка от 1 до 5', nullable: true })
  rating: number | null;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { description: 'Фото пользователя', nullable: true })
  profileImage: string | null;

  @Column({ unique: true })
  @Field({ description: 'Email пользователя' })
  email: string;

  @Column()
  @Field({ description: 'Password пользователя' })
  password: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { description: 'Refresh token', nullable: true })
  refreshToken: string | null;

  @OneToMany(() => Listing, (listing) => listing.user, { eager: true })
  @Field(() => [Listing], {
    description: 'Объявления пользователя',
    nullable: true,
  })
  listings?: Listing[];

  @OneToMany(() => Review, (review) => review.recipient, {
    onDelete: 'CASCADE',
  })
  @Field(() => [Review], {
    nullable: true,
    description: 'Отзывы, полученные пользователем',
  })
  receivedReviews?: Review[];

  @OneToMany(() => Review, (review) => review.sender, {
    onDelete: 'CASCADE',
  })
  @Field(() => [Review], {
    nullable: true,
    description: 'Отзывы, оставленные пользователем',
  })
  sentReviews?: Review[];

  @OneToMany(() => Dialog, (dialog) => dialog.userReceivedDialog, {
    onDelete: 'CASCADE',
  })
  @Field(() => [Dialog], {
    nullable: true,
    description: 'Диалоги, полученные пользователем',
  })
  receivedDialogs?: Dialog[];

  @OneToMany(() => Message, (message) => message.sender)
  @Field(() => [Message], {
    nullable: true,
    description: 'Сообщения, отправленные пользователем',
  })
  messages?: Message[];

  @OneToMany(() => Dialog, (dialog) => dialog.userSenderDialog, {
    onDelete: 'CASCADE',
  })
  @Field(() => [Dialog], {
    nullable: true,
    description: 'Диалоги, начатые пользователем',
  })
  sentDialogs?: Dialog[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field({ description: 'Дата создания пользователя' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field({ description: 'Дата последнего обновления пользователя' })
  updatedAt: Date;
}
