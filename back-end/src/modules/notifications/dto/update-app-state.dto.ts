import { ApiProperty } from "@nestjs/swagger";
import { IsObject } from "class-validator";

export class UpdateAppStateDto {
  @ApiProperty({ example: { activeTab: "saved", filters: { district: "Quan 7" } } })
  @IsObject()
  payload!: Record<string, unknown>;
}
