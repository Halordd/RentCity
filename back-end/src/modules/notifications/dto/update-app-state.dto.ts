import { IsObject } from "class-validator";

export class UpdateAppStateDto {
  @IsObject()
  payload!: Record<string, unknown>;
}
