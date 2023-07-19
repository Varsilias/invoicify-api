import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ItemEntity } from '../entities/item.entity';

@Injectable()
export class ItemRepository extends Repository<ItemEntity> {
  constructor(private dataSource: DataSource) {
    super(ItemEntity, dataSource.createEntityManager());
  }
}
