import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PaymentStatus } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";

export class PaymentWebhookDto {
  @ApiProperty({ example: "rc_1719820000_abcd1234" })
  @IsString()
  reference!: string;

  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.PAID })
  @IsEnum(PaymentStatus)
  status!: PaymentStatus;

  @ApiPropertyOptional({ example: 1000000, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  amount?: number;

  @ApiPropertyOptional({ example: "payos" })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({ example: "payos:event:123" })
  @IsOptional()
  @IsString()
  eventId?: string;
}
