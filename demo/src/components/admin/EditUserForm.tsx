import React, { useState } from "react";
import { type User } from "../../types";

interface Props {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

export default function EditUserForm({ user, onSave, onCancel }: Props) {
  const [form, setForm] = useState<User>({ ...user });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev: User) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 border border-teal-600 overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4 text-teal-400">Edit User</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Email</label>
            <input
              type="email"
              name="mail"
              value={form.mail}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Role</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="supplier">Supplier</option>
              <option value="delivery">Delivery</option>
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
