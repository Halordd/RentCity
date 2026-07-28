import { ApiProperty } from "@nestjs/swagger";
import { IsObject, IsUrl } from "class-validator";

export class CreatePushSubscriptionDto {
  @ApiProperty({ example: "https://push.example/subscription/abc" })
  @IsUrl({ require_tld: false })
  endpoint!: string;

  @ApiProperty({ example: { p256dh: "public-key", auth: "auth-secret" } })
  @IsObject()
  keys!: Record<string, unknown>;
}
