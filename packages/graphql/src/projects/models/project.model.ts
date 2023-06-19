import { Column, Entity, OneToMany } from 'typeorm';
import { Product } from '../../products/models/product.model';
import { AbstractEntity } from '../../common/abstract-entity.model';

@Entity('projects')
export class Project extends AbstractEntity {
  @Column()
  title: string;
  @OneToMany(() => Product, (product) => product.project)
  products: Product[];
}
