import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field(() => ID, { description: 'ID диалога' })
  dialogId: string;

  @Field(() => ID, { description: 'ID отправителя' })
  senderId: string;

  @Field(() => String, { description: 'Текст сообщения' })
  text: string;
}
