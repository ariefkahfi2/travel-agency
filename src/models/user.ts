import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

enum UserRole {
  CUSTOMER = "customer",
  ADMIN = "admin"
}

@Entity({
  name: "users"
})
export default class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({
    unique: true,
    nullable: false
  })
  email: string

  @Column({
    enum: UserRole,
    type: "enum",
    default: UserRole.CUSTOMER,
    nullable: false
  })
  role: string

  @Column({
    nullable: false
  })
  password: string

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp"
  })
  createdAt: Date

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp"
  })
  updatedAt: Date
}