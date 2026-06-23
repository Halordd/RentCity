export interface CurrentUser {
  id: string;
  role: "TENANT" | "OWNER" | "ADMIN";
  phone: string;
}

export const demoUser: CurrentUser = {
  id: "demo-user",
  role: "TENANT",
  phone: "+84912345678"
};
