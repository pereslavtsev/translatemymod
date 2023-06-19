import { AbstractEntity } from '../../common/abstract-entity.model';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ProductRelease } from '../../products/models/product-release.model';

@Entity('localisations')
export class Localisation extends AbstractEntity {
  @Column('varchar')
  key: string;
  @Column('varchar')
  language: string;
  @Column('text')
  value: string;
  @Column('uuid')
  productReleaseId: ProductRelease['id'];
  @ManyToOne(
    () => ProductRelease,
    (productRelease) => productRelease.localisations,
    { onDelete: 'CASCADE' },
  )
  productRelease: ProductRelease;
}
