import { useState } from "react";
import EditProductForm from "./EditProductForm"; // Import modal

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
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

export default function ProductList({ products, onEdit, onDelete }: Props) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  return (
    <>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow border border-teal-600 hover:shadow-teal-500/20 transition"
          >
            <img
              src={product.image}
              alt={product.name_en}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name_en}</h3>
              <p className="text-sm text-gray-400">
                {product.short_description_en}
              </p>
              <p className="mt-2 font-bold text-teal-400">
                {product.price.toFixed(2)} DZD
              </p>
              <div className="mt-3 flex justify-between">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="bg-teal-600 hover:bg-teal-700 px-3 py-1 rounded text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form for Editing */}
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onSave={(updatedProduct) => {
            onEdit(updatedProduct);
            setEditingProduct(null);
          }}
          onCancel={() => setEditingProduct(null)}
        />
      )}
    </>
  );
}
