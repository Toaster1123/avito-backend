import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateDialogInput } from './create-dialog.input';

@InputType()
export class UpdateDialogInput extends PartialType(CreateDialogInput) {
  @Field(() => ID, { description: 'ID диалога' })
  id: string;
}
