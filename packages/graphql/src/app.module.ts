import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { RepositoriesModule } from './repositories/repositories.module';
import { LocalisationsModule } from './localisations/localisations.module';
import { FilesModule } from './files/files.module';
import { DirectoriesModule } from './directories/directories.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ProjectsModule,
    RepositoriesModule,
    LocalisationsModule,
    FilesModule,
    DirectoriesModule,
    UsersModule,
    ProductsModule,
  ],
})
export class AppModule {}
