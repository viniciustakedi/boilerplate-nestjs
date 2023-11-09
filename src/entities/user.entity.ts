import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, BeforeInsert, BaseEntity } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { hashPassword } from 'src/utils';
import { randomUUID } from 'node:crypto';
import { ERole } from 'src/models/roles';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn('uuid', {
    nullable: false,
    name: 'id',
  })
  public id: string;

  @Column('varchar', {
    nullable: false,
    length: 255,
    name: 'name',
  })
  public name: string;

  @Column('varchar', {
    length: 155,
    nullable: false,
    unique: true,
    name: 'email',
  })
  public email: string;

  @Column('varchar', {
    length: 11,
    nullable: true,
    unique: true,
    name: 'phone',
  })
  public phone: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
    name: 'password',
  })
  public password: string;

  @Column('varchar', {
    length: 6,
    nullable: false,
    unique: true,
    name: 'code',
  })
  public code: string;

  @Column('text', {
    nullable: false,
    name: 'role',
  })
  public role: ERole;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: null,
  })
  public updatedAt: Date;

  @Column({
    name: 'is_deleted',
    default: false,
  })
  public isDeleted: boolean;

  @BeforeInsert()
  async generateUUID(): Promise<void> {
    this.id = randomUUID();
  }

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const pass = this.password;
    if (pass) {
      this.password = await hashPassword(pass);
    } else {
      throw new BadRequestException('Senha inválida.');
    }
  }

  constructor(init?: Partial<User>) {
    super();
    Object.assign(this, init);
  }
}
