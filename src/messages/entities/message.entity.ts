import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Dialog } from 'src/dialogs/entities/dialog.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Уникальный ID сообщения' })
  id: string;

  @ManyToOne(() => Dialog, (dialog) => dialog.messages, { onDelete: 'CASCADE' })
  @Field(() => Dialog, {
    description: 'Диалог, к которому принадлежит сообщение',
  })
  dialog: Dialog;

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  @Field(() => User, {
    description: 'Пользователь, который отправил сообщение',
  })
  sender: User;

  @Column({ type: 'text' })
  @Field(() => String, { description: 'Текст сообщения' })
  text: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date, { description: 'Дата создания сообщения' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date, { description: 'Дата обновления сообщения' })
  updatedAt: Date;
}
