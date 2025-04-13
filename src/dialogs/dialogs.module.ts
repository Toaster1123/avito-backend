import { Module } from '@nestjs/common';
import { DialogsService } from './dialogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dialog } from './entities/dialog.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Dialog]), UserModule],
  providers: [DialogsService],
  exports: [DialogsService, TypeOrmModule],
})
export class DialogsModule {}
