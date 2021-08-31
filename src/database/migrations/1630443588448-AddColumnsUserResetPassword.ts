import {
  MigrationInterface,
  QueryRunner,
  TableColumn

} from 'typeorm'

export class AddColumnsUserResetPassword1630443588448 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'token_reset',
        type: 'varchar',
        isNullable: true,
        isUnique: true

      }),
      new TableColumn({
        name: 'token_expired',
        type: 'timestamp',
        isNullable: true

      })
    ])
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('users', [
      new TableColumn({ name: 'token_reset', type: 'varchar' }),
      new TableColumn({ name: 'token_expired', type: 'timestamp' })
    ])
  }
}
