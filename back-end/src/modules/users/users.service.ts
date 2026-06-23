import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  profile() {
    return {
      id: "demo-user",
      fullName: "Nguyen Minh Anh",
      phone: "+84912345678",
      role: "TENANT",
      preferredArea: "Quan 7"
    };
  }
}
