import { type ReactNode, useState } from "react";
import { LogContext } from "./context";
import { type Log } from "../types";

interface Props {
  children: ReactNode;
}

export default function LogProvider({ children }: Props) {
  const [logs, setLogs] = useState<Log[]>([]);

  const addLog = (log: Omit<Log, "id" | "timestamp">) => {
    const newLog: Log = {
      ...log,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <LogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
}
