import { Controller, Get } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me/profile")
  profile() {
    return ok(this.usersService.profile());
  }
}
