import React from "react";

interface Props {
  activeTab: string;
  setActiveTab: React.Dispatch<
    React.SetStateAction<"products" | "cart" | "orders" | "settings">
  >;
}

export default function DashBoardNav({ activeTab, setActiveTab }: Props) {
  return (
    <nav className="w-64 bg-gray-800 p-6 h-screen fixed">
      <h2 className="text-xl font-semibold mb-6">Customer Dashboard</h2>
      <ul className="space-y-3">
        <li>
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              activeTab === "products"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700"
            }`}
          >
            Browse Products
          </button>
        </li>
        <li>
          <button
            onClick={() => setActiveTab("cart")}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              activeTab === "cart"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700"
            }`}
          >
            Shopping Cart
          </button>
        </li>
        <li>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              activeTab === "orders"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700"
            }`}
          >
            Order History
          </button>
        </li>
        <li>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              activeTab === "settings"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700"
            }`}
          >
            Settings
          </button>
        </li>
      </ul>
    </nav>
  );
}
