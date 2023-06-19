import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Product } from './product.model';
import { Localisation } from '../../localisations/models/localisation.model';
import { AbstractEntity } from '../../common/abstract-entity.model';

@Entity('product-releases')
export class ProductRelease extends AbstractEntity {
  @Column('uuid')
  productId: Product['id'];
  @ManyToOne(() => Product, (product) => product.releases)
  @JoinColumn({ referencedColumnName: 'product_id' })
  product: Product;
  @OneToMany(() => Localisation, (localisation) => localisation.productRelease)
  localisations: Localisation[];
}
