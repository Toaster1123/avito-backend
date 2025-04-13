import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dialog } from './entities/dialog.entity';
import { CreateDialogInput } from './dto/create-dialog.input';
import { UpdateDialogInput } from './dto/update-dialog.input';
import { User } from '../user/entities/user.entity';

@Injectable()
export class DialogsService {
  constructor(
    @InjectRepository(Dialog)
    private readonly dialogRepository: Repository<Dialog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async create(createDialogInput: CreateDialogInput): Promise<Dialog> {
    const { userSenderDialogId, userReceivedDialogId } = createDialogInput;

    const userSenderDialog = await this.userRepository.findOneBy({
      id: userSenderDialogId,
    });
    if (!userSenderDialog) {
      throw new NotFoundException(
        `Пользователь с ID ${userSenderDialogId} не найден`,
      );
    }

    const userReceivedDialog = await this.userRepository.findOneBy({
      id: userReceivedDialogId,
    });
    if (!userReceivedDialog) {
      throw new NotFoundException(
        `Пользователь с ID ${userReceivedDialogId} не найден`,
      );
    }

    const dialog = this.dialogRepository.create({
      userSenderDialog,
      userReceivedDialog,
    });

    return this.dialogRepository.save(dialog);
  }

  public async findAll(): Promise<Dialog[]> {
    return this.dialogRepository.find({
      relations: ['userSenderDialog', 'userReceivedDialog'],
    });
  }

  public async findOne(id: string): Promise<Dialog> {
    const dialog = await this.dialogRepository.findOne({
      where: { id },
      relations: ['userSenderDialog', 'userReceivedDialog'],
    });
    if (!dialog) {
      throw new NotFoundException(`Диалог с ID ${id} не найден`);
    }
    return dialog;
  }

  public async findUserDialogs(userId: string): Promise<Dialog[]> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    return this.dialogRepository.find({
      where: [
        { userSenderDialog: { id: userId } },
        { userReceivedDialog: { id: userId } },
      ],
      relations: ['userSenderDialog', 'userReceivedDialog', 'messages'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  public async update(
    id: string,
    updateDialogInput: UpdateDialogInput,
  ): Promise<Dialog> {
    const dialog = await this.dialogRepository.findOne({
      where: { id },
      relations: ['userSenderDialog', 'userReceivedDialog'],
    });
    if (!dialog) {
      throw new NotFoundException(`Диалог с ID ${id} не найден`);
    }

    Object.assign(dialog, updateDialogInput);

    return this.dialogRepository.save(dialog);
  }

  public async remove(id: string): Promise<void> {
    const dialog = await this.dialogRepository.findOneBy({ id });
    if (!dialog) {
      throw new NotFoundException(`Диалог с ID ${id} не найден`);
    }

    await this.dialogRepository.delete(id);
  }
}
