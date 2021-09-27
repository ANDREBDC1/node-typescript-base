import {
  Entity,
  Column,
  PrimaryGeneratedColumn

} from 'typeorm'

@Entity('permissions')
class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  descript: string
}

export default Permission
