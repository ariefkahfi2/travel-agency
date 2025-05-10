import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsers1746836707064 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "email" VARCHAR(255) UNIQUE NOT NULL,
                "role" VARCHAR(50) DEFAULT 'customer' NOT NULL,
                "password" VARCHAR(255) NOT NULL,
                "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "users"
        `);
    }

}
