import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from 'typeorm'

export class CreateUserPermissions1630328233197 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table(
        {
          name: 'user_permissions',
          columns: [
            {
              name: 'id',
              type: 'varchar',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_V4()'
            },
            {
              name: 'user_id',
              type: 'varchar'
            },
            {
              name: 'permission_id',
              type: 'varchar'
            }

          ]

        })
    )

    await queryRunner.createForeignKey(
      'user_permissions',
      new TableForeignKey({
        name: 'permission_fk',
        columnNames: ['permission_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'permissions',
        onDelete: 'CASCADE'
      })
    )

    await queryRunner.createForeignKey(
      'user_permissions',
      new TableForeignKey({
        name: 'user_fk',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE'
      })
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropForeignKey('user_permissions', 'user_fk')
    queryRunner.dropForeignKey('user_permissions', 'permission_fk')
    queryRunner.dropTable('user_permissions')
  }
}
