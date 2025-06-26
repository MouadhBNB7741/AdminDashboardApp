import { useState, useContext } from "react";
import AdminNav from "../../components/admin/AdminNav";
import UserManagement from "../../components/admin/UserManagement";
import LogManagement from "../../components/admin/LogManagement";
import SettingsTab from "../../components/admin/SettingsTab";
import ProductManagement from "../../components/admin/ProductManagement";
import OrderManagement from "../../components/admin/OrderManagement";
import { AuthContext, LogContext } from "../../context/context";
import { type User } from "../../types";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

interface Order {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  quantity: number;
  totalPrice: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  date: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "users" | "logs" | "settings" | "products" | "orders"
  >("users");
  const { user } = useContext(AuthContext);
  const { logs, clearLogs } = useContext(LogContext);

  // Load users from localStorage
  const loadUsersFromStorage = (): User[] => {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  };

  const [users, setUsers] = useState<User[]>(loadUsersFromStorage());

  // Save users back to localStorage
  const saveUsersToStorage = (updatedUsers: User[]) => {
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  // Edit user
  const handleEditUser = (updatedUser: User) => {
    const updated = users.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    );
    saveUsersToStorage(updated);
  };

  // Delete user
  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updated = users.filter((u) => u.id !== userId);
      saveUsersToStorage(updated);
    }
  };

  // Products State
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Vitamin C",
      description: "Immune support supplement",
      price: 12.99,
      stock: 50,
      category: "Vitamins",
    },
  ]);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "101",
      productId: "1",
      productName: "Vitamin C",
      userId: "u1",
      userName: "John Doe",
      quantity: 2,
      totalPrice: 25.98,
      status: "shipped",
      date: Date.now(),
    },
  ]);

  // Product Handlers
  const handleAddProduct = (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts([...products, newProduct]);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  // Order Handlers
  const handleAddOrder = (order: Omit<Order, "id">) => {
    const newOrder = {
      ...order,
      id: Date.now().toString(),
    };
    setOrders([...orders, newOrder]);
  };

  const handleEditOrder = (updatedOrder: Order) => {
    setOrders(orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter((o) => o.id !== orderId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-teal-900 text-white flex">
      <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-4 md:p-8 overflow-auto md:ml-64 bg-gray-900">
        <div className="flex justify-end items-center mb-8">
          <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-lg shadow-md">
            <span className="bg-teal-500 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            <span className="font-semibold">{user!.name}</span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("settings")}
                className="p-2 rounded-full hover:bg-gray-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {activeTab === "users" && (
          <UserManagement
            users={users}
            onAddUser={() => {}}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        )}
        {activeTab === "logs" && (
          <LogManagement logs={logs} onClearLogs={clearLogs} />
        )}
        {activeTab === "settings" && <SettingsTab />}
        {activeTab === "products" && (
          <ProductManagement
            initialProducts={products}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}
        {activeTab === "orders" && (
          <OrderManagement
            initialOrders={orders}
            onAddOrder={handleAddOrder}
            onEditOrder={handleEditOrder}
            onDeleteOrder={handleDeleteOrder}
          />
        )}
      </main>
    </div>
  );
}
