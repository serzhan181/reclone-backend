import { MigrationInterface, QueryRunner } from 'typeorm';

export class postShouldNotify1679931078335 implements MigrationInterface {
  name = 'postShouldNotify1679931078335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" ADD "shouldNotify" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "shouldNotify"`);
  }
}
