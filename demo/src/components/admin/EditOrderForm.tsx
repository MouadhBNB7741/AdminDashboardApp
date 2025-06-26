import React, { useState } from "react";

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
  order: Order;
  onSave: (updatedOrder: Order) => void;
  onCancel: () => void;
}

export default function EditOrderForm({ order, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Order>({ ...order });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 border border-teal-600 overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4 text-teal-400">Edit Order</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Product Name</label>
            <input
              type="text"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Customer Name</label>
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Total Price</label>
            <input
              type="number"
              name="totalPrice"
              value={form.totalPrice}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
            >
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 px-6 py-2 rounded text-white transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded text-white transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
