import { IsObject, IsUrl } from "class-validator";

export class CreatePushSubscriptionDto {
  @IsUrl({ require_tld: false })
  endpoint!: string;

  @IsObject()
  keys!: Record<string, unknown>;
}
