import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1763230348357 implements MigrationInterface {
    name = 'InitialSchema1763230348357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vehicles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plate_no" character varying NOT NULL, "make" character varying, "model" character varying, "color" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "driver_id" uuid, CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "drivers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "license_number" character varying NOT NULL, "license_expiry" date NOT NULL, "verified_at" TIMESTAMP WITH TIME ZONE, "earnings_cents" bigint NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "vehicleId" uuid, CONSTRAINT "REL_8e224f1b8f05ace7cfc7c76d03" UNIQUE ("user_id"), CONSTRAINT "PK_92ab3fb69e566d3eb0cae896047" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('client', 'driver', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phone_e164" character varying NOT NULL, "display_name" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'client', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4263ae397e23dff35b72ddfd342" UNIQUE ("phone_e164"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."rides_status_enum" AS ENUM('requested', 'offered', 'assigned', 'driver_arrived', 'started', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "rides" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rider_user_id" uuid NOT NULL, "driver_id" uuid, "status" "public"."rides_status_enum" NOT NULL DEFAULT 'requested', "pickup" geometry(Point,4326) NOT NULL, "dropoff" geometry(Point,4326) NOT NULL, "est_price_cents" integer, "price_cents" integer, "distance_m" integer, "duration_s" integer, "requested_at" TIMESTAMP NOT NULL DEFAULT now(), "assigned_at" TIMESTAMP WITH TIME ZONE, "started_at" TIMESTAMP WITH TIME ZONE, "completed_at" TIMESTAMP WITH TIME ZONE, "cancelled_at" TIMESTAMP WITH TIME ZONE, "cancellation_reason" text, CONSTRAINT "PK_ca6f62fc1e999b139c7f28f07fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "earnings_ledger" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "driver_id" uuid NOT NULL, "ride_id" uuid, "amount_cents" bigint NOT NULL, "direction" text NOT NULL, "kind" text NOT NULL, "note" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_60b13c2ba53a475a57672f9296d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."documents_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "kind" character varying NOT NULL, "url" character varying NOT NULL, "status" "public"."documents_status_enum" NOT NULL DEFAULT 'pending', "meta" jsonb NOT NULL DEFAULT '{}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "reviewed_at" TIMESTAMP WITH TIME ZONE, "driver_id" uuid, "reviewed_by" uuid, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "device_tokens" ("user_id" uuid NOT NULL, "platform" text NOT NULL, "token" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c9cd0438c3a15913bd64111cf22" PRIMARY KEY ("user_id", "platform", "token"))`);
        await queryRunner.query(`CREATE TABLE "deposits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "driver_id" uuid NOT NULL, "amount_cents" bigint NOT NULL, "receipt_url" text NOT NULL, "status" text NOT NULL DEFAULT 'submitted', "notes" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "decided_at" TIMESTAMP WITH TIME ZONE, "decided_by" uuid, CONSTRAINT "PK_f49ba0cd446eaf7abb4953385d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD CONSTRAINT "FK_9c2e0a8772c9e43b32f57bfcfcc" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD CONSTRAINT "FK_8e224f1b8f05ace7cfc7c76d03b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD CONSTRAINT "FK_147d9e5f169aa23722c8d337d51" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rides" ADD CONSTRAINT "FK_1f6ec45ed182c614da31369d5c8" FOREIGN KEY ("rider_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rides" ADD CONSTRAINT "FK_fb13184768dea9734b022874c6f" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "earnings_ledger" ADD CONSTRAINT "FK_bf5f40c8e0c27ccd1addf57691c" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "earnings_ledger" ADD CONSTRAINT "FK_56068ae3006f15f015c405296da" FOREIGN KEY ("ride_id") REFERENCES "rides"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_05b8bee38d8cbe25623773e19e9" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_1a55d9fa0929f418bcbcb964181" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_tokens" ADD CONSTRAINT "FK_17e1f528b993c6d55def4cf5bea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deposits" ADD CONSTRAINT "FK_535c5feaf548dea7aa07daaa9f2" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deposits" ADD CONSTRAINT "FK_d3fba5bd3d8941c5753e8a34d2b" FOREIGN KEY ("decided_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposits" DROP CONSTRAINT "FK_d3fba5bd3d8941c5753e8a34d2b"`);
        await queryRunner.query(`ALTER TABLE "deposits" DROP CONSTRAINT "FK_535c5feaf548dea7aa07daaa9f2"`);
        await queryRunner.query(`ALTER TABLE "device_tokens" DROP CONSTRAINT "FK_17e1f528b993c6d55def4cf5bea"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_1a55d9fa0929f418bcbcb964181"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_05b8bee38d8cbe25623773e19e9"`);
        await queryRunner.query(`ALTER TABLE "earnings_ledger" DROP CONSTRAINT "FK_56068ae3006f15f015c405296da"`);
        await queryRunner.query(`ALTER TABLE "earnings_ledger" DROP CONSTRAINT "FK_bf5f40c8e0c27ccd1addf57691c"`);
        await queryRunner.query(`ALTER TABLE "rides" DROP CONSTRAINT "FK_fb13184768dea9734b022874c6f"`);
        await queryRunner.query(`ALTER TABLE "rides" DROP CONSTRAINT "FK_1f6ec45ed182c614da31369d5c8"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_147d9e5f169aa23722c8d337d51"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_8e224f1b8f05ace7cfc7c76d03b"`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP CONSTRAINT "FK_9c2e0a8772c9e43b32f57bfcfcc"`);
        await queryRunner.query(`DROP TABLE "deposits"`);
        await queryRunner.query(`DROP TABLE "device_tokens"`);
        await queryRunner.query(`DROP TABLE "documents"`);
        await queryRunner.query(`DROP TYPE "public"."documents_status_enum"`);
        await queryRunner.query(`DROP TABLE "earnings_ledger"`);
        await queryRunner.query(`DROP TABLE "rides"`);
        await queryRunner.query(`DROP TYPE "public"."rides_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "drivers"`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
    }

}
