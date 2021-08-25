import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from 'typeorm'

export class CreateAppointments1629733206340 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table(
        {
          name: 'appointments',
          columns: [
            {
              name: 'id',
              type: 'varchar',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_V4()'
            },
            {
              name: 'provider_id',
              type: 'varchar',
              isNullable: true
            },
            {
              name: 'date',
              type: 'timestamp'
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()'
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'now()'
            }

          ]

        })
    )

    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        name: 'provider_fk',
        columnNames: ['provider_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL'
      })
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropForeignKey('appointments', 'provider_fk')
    queryRunner.dropTable('appointments')
  }
}
