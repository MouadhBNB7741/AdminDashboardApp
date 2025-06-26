import { type Log } from "../../types";

interface Props {
  logs: Log[];
  onClearLogs: () => void;
}

export default function LogManagement({ logs, onClearLogs }: Props) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-teal-400">System Logs</h2>
        <button
          onClick={onClearLogs}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
        >
          Clear All Logs
        </button>
      </div>

      <div className="space-y-3">
        {logs.length === 0 && (
          <p className="text-gray-400 text-center py-6">No logs yet.</p>
        )}
        {logs.map((log, index) => (
          <div
            key={index}
            className={`p-4 rounded border ${
              log.type === "info"
                ? "border-teal-600 bg-teal-900/20"
                : log.type === "warning"
                ? "border-yellow-600 bg-yellow-900/20"
                : "border-red-600 bg-red-900/20"
            }`}
          >
            <p>
              <strong>{log.type.toUpperCase()}</strong> -{" "}
              {new Date(log.timestamp).toLocaleString()}
            </p>
            <p>{log.message}</p>
            <p className="mt-1 text-xs text-gray-400">User: {log.userId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
