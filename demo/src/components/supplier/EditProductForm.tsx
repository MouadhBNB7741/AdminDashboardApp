import { useState } from "react";

interface Product {
  id: number;
  supplier_id: number;
  category_id: number;
  sku: string;
  name_en: string;
  short_description_en: string;
  description_en: string;
  price: number;
  image: string;
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
    if (name === "price") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl overflow-auto max-h-[90vh] p-6 border border-teal-600">
        <h2 className="text-xl font-bold mb-4 text-teal-400">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Product Name</label>
            <input
              type="text"
              name="name_en"
              value={form.name_en}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">
              Short Description
            </label>
            <input
              type="text"
              name="short_description_en"
              value={form.short_description_en || ""}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Full Description</label>
            <textarea
              name="description_en"
              value={form.description_en || ""}
              onChange={handleChange}
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Price (DZD)</label>
            <input
              type="number"
              step="1"
              min="0"
              name="price"
              value={form.price || ""}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Image URL</label>
            <input
              type="text"
              name="image"
              value={form.image || ""}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
            />
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
