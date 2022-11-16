import { MigrationInterface, QueryRunner } from "typeorm";

export class $npmConfigName1668623021233 implements MigrationInterface {
    name = '$npmConfigName1668623021233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "profile_picture_urn" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subs" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "subImgUrn" character varying, "bannerUrn" character varying, "creator_name" character varying NOT NULL, CONSTRAINT "UQ_2ae46b179b70ab8179597adb8c0" UNIQUE ("name"), CONSTRAINT "PK_c2311ff9e741af88151e0aa2299" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2ae46b179b70ab8179597adb8c" ON "subs" ("name") `);
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "body" character varying NOT NULL, "username" character varying NOT NULL, "postId" integer NOT NULL, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "postImgUrn" character varying, "identifier" character varying NOT NULL, "title" character varying NOT NULL, "slug" character varying NOT NULL, "body" text, "subName" character varying, "username" character varying NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_152316363d20c399f934c4f74b" ON "posts" ("identifier") `);
        await queryRunner.query(`DROP INDEX "public"."IDX_2ae46b179b70ab8179597adb8c"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP CONSTRAINT "UQ_2ae46b179b70ab8179597adb8c0"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP COLUMN "subImgUrn"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP COLUMN "bannerUrn"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP COLUMN "creator_name"`);
        await queryRunner.query(`ALTER TABLE "subs" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subs" ADD CONSTRAINT "UQ_2ae46b179b70ab8179597adb8c0" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "subs" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subs" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subs" ADD "subImgUrn" character varying`);
        await queryRunner.query(`ALTER TABLE "subs" ADD "bannerUrn" character varying`);
        await queryRunner.query(`ALTER TABLE "subs" ADD "creator_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subs" ADD "likes" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subs" ADD "dislikes" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subs" ADD "username" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subs" ADD "postId" integer`);
        await queryRunner.query(`ALTER TABLE "subs" ADD "commentId" integer`);
        await queryRunner.query(`CREATE INDEX "IDX_2ae46b179b70ab8179597adb8c" ON "subs" ("name") `);
        await queryRunner.query(`ALTER TABLE "subs" ADD CONSTRAINT "FK_8585f1ea9143bf2ca003847c1d5" FOREIGN KEY ("creator_name") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subs" ADD CONSTRAINT "FK_4520ae7b26f68a13ec3e96dbbba" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subs" ADD CONSTRAINT "FK_68643a7f7e8432c2a3f815a015c" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subs" ADD CONSTRAINT "FK_394b9963b968d6713b0681af688" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_5d9144e84650ce78f40737e284e" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_42377e3f89a203ca74d117e5961" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_cca21672314ce54982a6dd5d121" FOREIGN KEY ("subName") REFERENCES "subs"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_cca21672314ce54982a6dd5d121"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_42377e3f89a203ca74d117e5961"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_5d9144e84650ce78f40737e284e"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP CONSTRAINT "FK_394b9963b968d6713b0681af688"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP CONSTRAINT "FK_68643a7f7e8432c2a3f815a015c"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP CONSTRAINT "FK_4520ae7b26f68a13ec3e96dbbba"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP CONSTRAINT "FK_8585f1ea9143bf2ca003847c1d5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2ae46b179b70ab8179597adb8c"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP COLUMN "commentId"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP COLUMN "postId"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP COLUMN "dislikes"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP COLUMN "likes"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP COLUMN "creator_name"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP COLUMN "bannerUrn"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP COLUMN "subImgUrn"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP CONSTRAINT "UQ_2ae46b179b70ab8179597adb8c0"`);
        await queryRunner.query(`ALTER TABLE "subs" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "subs" ADD "creator_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subs" ADD "bannerUrn" character varying`);
        await queryRunner.query(`ALTER TABLE "subs" ADD "subImgUrn" character varying`);
        await queryRunner.query(`ALTER TABLE "subs" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subs" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subs" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subs" ADD CONSTRAINT "UQ_2ae46b179b70ab8179597adb8c0" UNIQUE ("name")`);
        await queryRunner.query(`CREATE INDEX "IDX_2ae46b179b70ab8179597adb8c" ON "subs" ("name") `);
        await queryRunner.query(`DROP INDEX "public"."IDX_152316363d20c399f934c4f74b"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2ae46b179b70ab8179597adb8c"`);
        await queryRunner.query(`DROP TABLE "subs"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
