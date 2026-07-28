import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { DisputeStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateDisputeDto {
  @ApiProperty({ enum: DisputeStatus, example: DisputeStatus.RESOLVED })
  @IsEnum(DisputeStatus)
  status!: DisputeStatus;

  @ApiPropertyOptional({ example: "Resolved after contacting both sides." })
  @IsOptional()
  @IsString()
  note?: string;
}
