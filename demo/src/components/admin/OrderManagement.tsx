import { useState } from "react";
import EditOrderForm from "./EditOrderForm";

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

interface Props {
  initialOrders?: Order[];
  onAddOrder?: (order: Omit<Order, "id">) => void;
  onEditOrder?: (order: Order) => void;
  onDeleteOrder?: (orderId: string) => void;
}

export default function OrderManagement({
  initialOrders = [],
  onAddOrder = () => {},
  onEditOrder = () => {},
  onDeleteOrder = () => {},
}: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [newOrder, setNewOrder] = useState<Omit<Order, "id">>({
    productId: "",
    productName: "",
    userId: "",
    userName: "",
    quantity: 1,
    totalPrice: 0,
    status: "pending",
    date: Date.now(),
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter(
    (o) =>
      o.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (!newOrder.productId || !newOrder.userId) return;

    const orderWithId = {
      id: Date.now().toString(),
      ...newOrder,
    };
    const updated = [...orders, orderWithId];
    setOrders(updated);
    onAddOrder(orderWithId);
    setNewOrder({
      productId: "",
      productName: "",
      userId: "",
      userName: "",
      quantity: 1,
      totalPrice: 0,
      status: "pending",
      date: Date.now(),
    });
  };

  const handleEdit = (updatedOrder: Order) => {
    const updatedList = orders.map((o) =>
      o.id === updatedOrder.id ? updatedOrder : o
    );
    setOrders(updatedList);
    onEditOrder(updatedOrder);
    setEditingOrder(null);
  };

  const handleDelete = (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      const updated = orders.filter((o) => o.id !== orderId);
      setOrders(updated);
      onDeleteOrder(orderId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-teal-400">
        Order Management
      </h2>

      {/* Add New Order */}
      <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow border border-teal-600">
        <h3 className="text-lg font-medium mb-4">Add New Order</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            placeholder="Product ID"
            value={newOrder.productId}
            onChange={(e) =>
              setNewOrder({ ...newOrder, productId: e.target.value })
            }
            className="p-3 bg-gray-700 border border-gray-600 rounded text-white"
          />

          <input
            placeholder="Product Name"
            value={newOrder.productName}
            onChange={(e) =>
              setNewOrder({ ...newOrder, productName: e.target.value })
            }
            className="p-3 bg-gray-700 border border-gray-600 rounded text-white"
          />

          <input
            placeholder="User ID"
            value={newOrder.userId}
            onChange={(e) =>
              setNewOrder({ ...newOrder, userId: e.target.value })
            }
            className="p-3 bg-gray-700 border border-gray-600 rounded text-white"
          />

          <input
            placeholder="User Name"
            value={newOrder.userName}
            onChange={(e) =>
              setNewOrder({ ...newOrder, userName: e.target.value })
            }
            className="p-3 bg-gray-700 border border-gray-600 rounded text-white"
          />

          <div>
            <p className="text-xs text-gray-400 mb-1">Enter order quantity</p>
            <input
              type="number"
              placeholder="Quantity"
              value={newOrder.quantity}
              onChange={(e) =>
                setNewOrder({
                  ...newOrder,
                  quantity: parseInt(e.target.value),
                })
              }
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">Calculated total price</p>
            <input
              type="number"
              placeholder="Total Price"
              value={newOrder.totalPrice}
              onChange={(e) =>
                setNewOrder({
                  ...newOrder,
                  totalPrice: parseFloat(e.target.value),
                })
              }
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <select
            value={newOrder.status}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                status: e.target.value as Order["status"],
              })
            }
            className="p-3 bg-gray-700 border border-gray-600 rounded text-white"
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button
          onClick={handleAdd}
          className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded text-white"
        >
          Add Order
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by product or user name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  No orders found.
                </td>
              </tr>
            )}
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-700">
                <td className="px-4 py-3">{order.id}</td>
                <td className="px-4 py-3">{order.productName}</td>
                <td className="px-4 py-3">{order.userName}</td>
                <td className="px-4 py-3 capitalize">{order.status}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => setEditingOrder(order)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingOrder && (
        <EditOrderForm
          order={editingOrder}
          onSave={handleEdit}
          onCancel={() => setEditingOrder(null)}
        />
      )}
    </div>
  );
}
