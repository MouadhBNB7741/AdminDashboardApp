// context.ts
import { createContext } from "react";
import { type User, type Log } from "../types";

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
});

interface LogContextType {
  logs: Log[];
  addLog: (log: Omit<Log, "id" | "timestamp">) => void;
  clearLogs: () => void;
}

export const LogContext = createContext<LogContextType>({
  logs: [],
  addLog: () => {},
  clearLogs: () => {},
});
