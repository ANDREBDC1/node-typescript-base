import {
  MigrationInterface,
  QueryRunner,
  Table,
  Unique
} from 'typeorm'

export class CreatePermissions1630326570634 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table(
        {
          name: 'permissions',
          columns: [
            {
              name: 'id',
              type: 'varchar',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_V4()'
            },
            {
              name: 'descript',
              type: 'varchar',
              isUnique: true

            }

          ]

        })
    )

    await queryRunner
      .manager
      .createQueryBuilder()
      .insert()
      .into('permissions')
      .values([
        { descript: 'admin' },
        { descript: 'user' },
        { descript: 'barber' }
      ])
      .execute()
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('permissions')
  }
}
