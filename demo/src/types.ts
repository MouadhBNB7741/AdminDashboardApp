export interface User {
  id: string;
  name: string;
  mail: string;
  password: string;
  type: "customer" | "supplier" | "admin" | "delivery";
}
