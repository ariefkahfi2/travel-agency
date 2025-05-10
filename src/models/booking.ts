import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import User from "./user";

enum TransactionStatusRole {
  PENDING = "pending",
  PAID = "paid",
  OTHER = "other"
}

@Entity({
  name: "bookings"
})
export default class Booking {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    nullable: false,
  })
  origin: string

  @Column({
    nullable: false,
  })
  destination: string

  @Column({
    nullable: false,
    type: "timestamp",
    name: "departure_time"
  })
  departureTime: Date

  @Column({
    type: "timestamp",
    nullable: false,
    name: "estimation_time_arrival"
  })
  estimationTimeArrival: Date

  @Column({
    unique: true,
    nullable: false,
    name: "booking_code"
  })
  bookingCode: string

  @Column({
    enum: TransactionStatusRole,
    type: "enum",
    default: TransactionStatusRole.PENDING,
    nullable: false,
    name: "transaction_status"
  })
  transactionStatus: string

  @Column({
    nullable: false,
    name: "invoice_url"
  })
  invoiceUrl: string

  @Column({
    nullable: false,
    type: "float"
  })
  price: number

  @CreateDateColumn({
    name: "created_at"
  })
  createdAt: Date

  @UpdateDateColumn({
    name: "updated_at"
  })
  updatedAt: Date

  @OneToOne(() => User)
  @JoinColumn({
    name: "created_by"
  })
  createdBy: User | null

  @OneToOne(() => User, {
    eager: true
  })
  @JoinColumn({
    name: "user_id"
  })
  user: User | null
}