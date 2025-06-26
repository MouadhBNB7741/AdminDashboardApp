import { useState } from "react";
import EditProductForm from "./EditProductForm";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

interface Props {
  initialProducts?: Product[];
  onAddProduct?: (product: Omit<Product, "id">) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
}

export default function ProductManagement({
  initialProducts = [],
  onAddProduct = () => {},
  onEditProduct = () => {},
  onDeleteProduct = () => {},
}: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (!newProduct.name || newProduct.price <= 0 || newProduct.stock < 0)
      return;

    const productWithId = {
      id: Date.now().toString(),
      ...newProduct,
    };
    const updated = [...products, productWithId];
    setProducts(updated);
    onAddProduct(productWithId);
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
    });
  };

  const handleEdit = (updatedProduct: Product) => {
    const updatedList = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    setProducts(updatedList);
    onEditProduct(updatedProduct);
    setEditingProduct(null);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updated = products.filter((p) => p.id !== productId);
      setProducts(updated);
      onDeleteProduct(productId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-teal-400">
        Product Management
      </h2>

      {/* Add New Product */}
      <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow border border-teal-600">
        <h3 className="text-lg font-medium mb-4">Add New Product</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="p-3 bg-gray-700 border border-gray-600 rounded text-white"
          />

          <input
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="p-3 bg-gray-700 border border-gray-600 rounded text-white"
          />

          <div>
            <p className="text-xs text-gray-400 mb-1">
              Enter product price per unit
            </p>
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  price: parseFloat(e.target.value),
                })
              }
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">
              Enter available quantity in stock
            </p>
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  stock: parseInt(e.target.value),
                })
              }
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            className="p-3 bg-gray-700 border border-gray-600 rounded text-white col-span-2"
            rows={3}
          ></textarea>
        </div>
        <button
          onClick={handleAdd}
          className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded text-white"
        >
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or category..."
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
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-400">
                  No products found.
                </td>
              </tr>
            )}
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-700">
                <td className="px-4 py-3">{product.id}</td>
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
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
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onSave={handleEdit}
          onCancel={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}
