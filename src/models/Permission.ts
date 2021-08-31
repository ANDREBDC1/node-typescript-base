import {
  Entity,
  Column,
  PrimaryGeneratedColumn

} from 'typeorm'

@Entity('permissions')
class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  descript: string
}

export default Permission
