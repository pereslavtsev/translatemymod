import { AbstractEntity } from '../../common/abstract-entity.model';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Project } from '../../projects/models/project.model';
import { ProductRelease } from './product-release.model';

@Entity('product')
export class Product extends AbstractEntity {
  @Column('uuid')
  projectId: Project['id'];
  @ManyToOne(() => Project, (project) => project.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'project_id' })
  project: Project;
  @OneToMany(() => ProductRelease, (productRelease) => productRelease.product)
  releases: ProductRelease[];
}
