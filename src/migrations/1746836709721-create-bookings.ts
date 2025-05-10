import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBookings1746836709721 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "bookings" (
            "id" SERIAL PRIMARY KEY,
            "origin" VARCHAR(255) NOT NULL,
            "destination" VARCHAR(255) NOT NULL,
            "departure_time" TIMESTAMP NOT NULL,
            "estimation_time_arrival" TIMESTAMP NOT NULL,
            "booking_code" VARCHAR(255) UNIQUE NOT NULL,
            "invoice_url" VARCHAR(255) UNIQUE NOT NULL,
            "price" FLOAT NOT NULL,
            "transaction_status" VARCHAR(50) DEFAULT 'pending' NOT NULL,
            "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            "created_by" INTEGER,
            "user_id" INTEGER,
            FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE,
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "bookings"
        `);
    }

}
