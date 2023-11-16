import { DatabaseModule } from '../../configurations/database.module';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { userProviders } from '../../repositories';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../auth/roles/roles.guard';
import { databaseProviders } from 'src/configurations/database.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    ...databaseProviders,
    ...userProviders,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [UsersService],
})

// Outra forma de injetar dependencias.

// Dentro do module, exportar do module que origina e importar no module desejado
// imports: [DatabaseModule, RolesModule, forwardRef(() => EmployeeRolesModule)],
// forwardRef serve para resolver conflito, quando é importando a para b e b para a

// Dentro do service no constructor

// @Inject(forwardRef(() => EmployeeRolesModule))
// private readonly employeeRolesService: EmployeeRolesService

export class UsersModule {}
