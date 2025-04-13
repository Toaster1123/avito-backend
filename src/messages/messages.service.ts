import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { Dialog } from '../dialogs/entities/dialog.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Dialog)
    private readonly dialogRepository: Repository<Dialog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async create(
    createMessageInput: CreateMessageInput,
  ): Promise<Message> {
    const { dialogId, senderId, text } = createMessageInput;

    const dialog = await this.dialogRepository.findOneBy({ id: dialogId });
    if (!dialog) {
      throw new NotFoundException(`Диалог с ID ${dialogId} не найден`);
    }
    const sender = await this.userRepository.findOneBy({ id: senderId });
    if (!sender) {
      throw new NotFoundException(`Пользователь с ID ${senderId} не найден`);
    }
    const message = this.messageRepository.create({
      dialog,
      sender,
      text,
    });
    return this.messageRepository.save(message);
  }

  public async findByDialog(
    dialogId: string,
    limit = 20,
    offset = 0,
  ): Promise<Message[]> {
    const dialog = await this.dialogRepository.findOneBy({ id: dialogId });
    if (!dialog) {
      throw new NotFoundException(`Диалог с ID ${dialogId} не найден`);
    }

    return this.messageRepository.find({
      where: { dialog: { id: dialogId } },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });
  }

  public async findOne(id: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['dialog', 'sender'],
    });
    if (!message) {
      throw new NotFoundException(`Сообщение с ID ${id} не найдено`);
    }
    return message;
  }

  public async update(
    id: string,
    updateMessageInput: UpdateMessageInput,
  ): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['dialog', 'sender'],
    });
    if (!message) {
      throw new NotFoundException(`Сообщение с ID ${id} не найдено`);
    }

    Object.assign(message, updateMessageInput);

    return this.messageRepository.save(message);
  }

  public async remove(id: string): Promise<void> {
    const message = await this.messageRepository.findOneBy({ id });
    if (!message) {
      throw new NotFoundException(`Сообщение с ID ${id} не найдено`);
    }
    await this.messageRepository.delete(id);
  }
}
