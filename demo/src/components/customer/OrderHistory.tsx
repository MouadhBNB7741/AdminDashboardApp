import { useState } from "react";

export interface Order {
  id: number | string;
  date: string;
  items: string[];
  total: number;
  status?: string;
}

interface Props {
  orders: Order[];
}

export default function OrderHistory({ orders }: Props) {
  const [statusFilter, setStatusFilter] = useState("");

  const filteredOrders = orders.filter((order) =>
    statusFilter ? order.status === statusFilter : true
  );

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-6 text-center text-teal-400">
        Order History
      </h2>

      <div className="mb-6 flex justify-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 bg-gray-800 border border-gray-600 rounded text-white"
        >
          <option value="">All Statuses</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-400 text-center py-6">
          No matching orders found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order, idx) => (
            <div
              key={idx}
              className="bg-gray-800 p-5 rounded-lg shadow border border-teal-600 transition hover:shadow-teal-500/20"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold">{order.id}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    order.status === "Delivered"
                      ? "bg-green-800 text-green-200"
                      : order.status === "Shipped"
                      ? "bg-blue-800 text-blue-200"
                      : "bg-yellow-800 text-yellow-200"
                  }`}
                >
                  {order.status || "Processing"}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Date: {order.date}</p>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-300">
                {order.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p className="mt-2 font-bold text-teal-400">
                {order.total.toFixed(2)} DZD
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
