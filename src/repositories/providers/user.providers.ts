import { DataSource } from 'typeorm';
import { User } from 'src/entities';
import { DataSourceType } from 'src/models/database';
import { ERepository } from 'src/models/repositories';

export const userProviders = [
  {
    provide: ERepository.user,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DataSourceType],
  },
];
