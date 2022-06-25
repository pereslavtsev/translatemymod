import { Module } from '@nestjs/common';
import { TranslateCommand } from './translate.command';

@Module({
  imports: [],
  providers: [TranslateCommand],
})
export class AppModule {}
