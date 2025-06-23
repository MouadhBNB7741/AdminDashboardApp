export interface User {
  id: string;
  name: string;
  mail: string;
  password: string;
  type: "customer" | "supplier" | "admin" | "delivery";
}

//supplier howa li ymanagi shit
//delivery ychof deliveries
//customer ychof his
//admin ymanager

export interface Log {
  id: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: string; // ISO format
  userId?: string; // optional, could be linked to User
}
