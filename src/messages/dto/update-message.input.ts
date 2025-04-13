import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateMessageInput } from './create-message.input';

@InputType()
export class UpdateMessageInput extends PartialType(CreateMessageInput) {
  @Field(() => ID, { description: 'ID сообщения' })
  id: string;
}
