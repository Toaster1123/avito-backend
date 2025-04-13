import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DialogsService } from './dialogs.service';
import { Dialog } from './entities/dialog.entity';
import { CreateDialogInput } from './dto/create-dialog.input';
import { UpdateDialogInput } from './dto/update-dialog.input';

@Resolver(() => Dialog)
export class DialogsResolver {
  constructor(private readonly dialogsService: DialogsService) {}

  @Mutation(() => Dialog, { name: 'createDialog' })
  async createDialog(
    @Args('createDialogInput') createDialogInput: CreateDialogInput,
  ): Promise<Dialog> {
    return this.dialogsService.create(createDialogInput);
  }

  @Query(() => [Dialog], { name: 'dialogs', nullable: 'items' })
  async findAll(): Promise<Dialog[]> {
    return this.dialogsService.findAll();
  }

  @Query(() => Dialog, { name: 'dialog', nullable: true })
  async findOne(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Dialog | null> {
    return this.dialogsService.findOne(id);
  }

  @Query(() => [Dialog])
  async getUserDialogs(@Args('userId', { type: () => String }) userId: string) {
    return this.dialogsService.findUserDialogs(userId);
  }

  @Mutation(() => Dialog, { name: 'updateDialog' })
  async updateDialog(
    @Args('updateDialogInput') updateDialogInput: UpdateDialogInput,
  ): Promise<Dialog> {
    return this.dialogsService.update(updateDialogInput.id, updateDialogInput);
  }

  @Mutation(() => Dialog, { name: 'removeDialog' })
  async removeDialog(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Dialog> {
    const dialog = await this.dialogsService.findOne(id);
    await this.dialogsService.remove(id);
    return dialog;
  }
}
