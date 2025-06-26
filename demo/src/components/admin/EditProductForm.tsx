import React, { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

interface Props {
  product: Product;
  onSave: (updatedProduct: Product) => void;
  onCancel: () => void;
}

export default function EditProductForm({ product, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Product>({ ...product });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        <h2 className="text-xl font-bold mb-4 text-teal-400">Edit Product</h2>
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
            <label className="block text-gray-400 mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
              rows={3}
            ></textarea>
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
