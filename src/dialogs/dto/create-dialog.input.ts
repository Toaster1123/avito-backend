import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateDialogInput {
  @Field(() => ID, { description: 'ID пользователя, который создал диалог' })
  userSenderDialogId: string;

  @Field(() => ID, { description: 'ID пользователя, который получил диалог' })
  userReceivedDialogId: string;
}
