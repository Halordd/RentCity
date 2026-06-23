import { PartialType } from "@nestjs/mapped-types";
import { CreateOwnerListingDto } from "./create-owner-listing.dto";

export class UpdateOwnerListingDto extends PartialType(CreateOwnerListingDto) {}
