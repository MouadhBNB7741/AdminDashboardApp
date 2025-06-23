// context.ts
import { createContext } from "react";
import { type User } from "../types";

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

export const authContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
});
