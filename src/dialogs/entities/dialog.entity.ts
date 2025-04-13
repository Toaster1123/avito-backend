import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Dialog {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Уникальный ID диалога' })
  id: string;

  @ManyToOne(() => User, (user) => user.sentDialogs, { onDelete: 'CASCADE' })
  @Field(() => User, { description: 'Пользователь, который создал диалог' })
  userSenderDialog: User;

  @ManyToOne(() => User, (user) => user.receivedDialogs, {
    onDelete: 'CASCADE',
  })
  @Field(() => User, { description: 'Пользователь, которому отправлен диалог' })
  userReceivedDialog: User;

  @OneToMany(() => Message, (message) => message.dialog)
  @Field(() => [Message], {
    nullable: true,
    description: 'Сообщения в диалоге',
  })
  messages: Message[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date, { description: 'Дата создания диалога' })
  createdAt: Date;
}
