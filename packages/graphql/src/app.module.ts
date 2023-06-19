import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { RepositoriesModule } from './repositories/repositories.module';
import { LocalisationsModule } from './localisations/localisations.module';
import { FilesModule } from './files/files.module';
import { DirectoriesModule } from './directories/directories.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [],
      synchronize: true,
    }),
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
