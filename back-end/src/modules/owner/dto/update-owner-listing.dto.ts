import { PartialType } from "@nestjs/swagger";
import { CreateOwnerListingDto } from "./create-owner-listing.dto";

export class UpdateOwnerListingDto extends PartialType(CreateOwnerListingDto) {}
