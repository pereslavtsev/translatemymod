import { Module } from '@nestjs/common';
import { TranslateCommand } from './translate.command';

@Module({
  providers: [TranslateCommand],
})
export class TranslateModule {}
