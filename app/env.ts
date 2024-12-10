import dotenv from "dotenv";

dotenv.config();

export enum StageEnum {
  PROD = "prod",
  UAT = "uat",
  DEV = "dev",
  TEST = "test",
}

export class Env {
  static readonly STAGE: StageEnum = (process.env.STAGE as StageEnum) || StageEnum.TEST;

  static readonly DATABASE_URL: string | undefined = process.env.DATABASE_URL;

}
