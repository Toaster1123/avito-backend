import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
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

  @Query(() => [Message], { name: 'messages', nullable: 'items' })
  async findAll(): Promise<Message[]> {
    return this.messagesService.findAll();
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
