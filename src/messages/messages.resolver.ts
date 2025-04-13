import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Mutation(() => Message, { name: 'createMessage' })
  async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
  ): Promise<Message> {
    return this.messagesService.create(createMessageInput);
  }

  @Query(() => [Message], { name: 'messagesByDialog' })
  async findByDialog(
    @Args('dialogId', { type: () => String }) dialogId: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ): Promise<Message[]> {
    return this.messagesService.findByDialog(
      dialogId,
      limit ?? 20,
      offset ?? 0,
    );
  }

  @Query(() => Message, { name: 'message', nullable: true })
  async findOne(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Message | null> {
    return this.messagesService.findOne(id);
  }

  @Mutation(() => Message, { name: 'updateMessage' })
  async updateMessage(
    @Args('updateMessageInput') updateMessageInput: UpdateMessageInput,
  ): Promise<Message> {
    return this.messagesService.update(
      updateMessageInput.id,
      updateMessageInput,
    );
  }

  @Mutation(() => Message, { name: 'removeMessage' })
  async removeMessage(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Message> {
    const message = await this.messagesService.findOne(id);
    await this.messagesService.remove(id);
    return message;
  }
}
