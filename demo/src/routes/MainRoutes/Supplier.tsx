import { useState, useContext } from "react";
import SupplierNav from "../../components/supplier/SupplierNav";
import ProductList from "../../components/supplier/ProductList";
import OrderHistory from "../../components/supplier/OrderHistory";
import Inventory from "../../components/supplier/Inventory";
import ProfileSettings from "../../components/supplier/ProfileSettings";
import { AuthContext } from "../../context/context";

// Define types locally or import from your types.ts
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

interface Order {
  id: number | string;
  date: string;
  items: string[];
  total: number;
  status?: string;
}

interface StockLevel {
  id: number;
  product: string;
  currentStock: number;
  minStock: number;
}

interface SupplierProfile {
  id: number;
  businessName: string;
  contactEmail: string;
  phone: string;
  address: string;
  licenseNumber: string;
}

export default function SupplierDashboard() {
  const [activeTab, setActiveTab] = useState<
    "products" | "orders" | "inventory" | "settings"
  >("products");
  const { user } = useContext(AuthContext);

  // Mock Products
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      supplier_id: 101,
      category_id: 5,
      sku: "PROD-001",
      name_en: "Pain Reliever Tablets",
      short_description_en: "Fast acting pain relief tablets",
      description_en: "Fast acting pain relief tablets",
      price: 450.0,
      image: "https://picsum.photos/id/1/300/200",
    },
    {
      id: 2,
      supplier_id: 102,
      category_id: 6,
      sku: "PROD-002",
      name_en: "Digital Blood Pressure Monitor",
      short_description_en: "Home-use blood pressure monitor",
      description_en: "Home-use blood pressure monitor",
      price: 3500.0,
      image: "https://picsum.photos/id/2/300/200",
    },
    {
      id: 3,
      supplier_id: 103,
      category_id: 7,
      sku: "PROD-003",
      name_en: "Face Mask Pack",
      short_description_en: "Disposable surgical masks - 50 pcs",
      description_en: "Disposable surgical masks - 50 pcs",
      price: 800.0,
      image: "https://picsum.photos/id/3/300/200",
    },
  ]);

  // Mock Orders
  const [orders] = useState<Order[]>([
    {
      id: "ORD-1001",
      date: new Date().toISOString().split("T")[0],
      items: ["Pain Reliever Tablets", "Face Mask Pack"],
      total: 4500,
      status: "Processing",
    },
    {
      id: "ORD-1002",
      date: new Date().toISOString().split("T")[0],
      items: ["Digital Blood Pressure Monitor"],
      total: 3500,
      status: "Shipped",
    },
  ]);

  // Mock Inventory
  const [stockLevels] = useState<StockLevel[]>([
    {
      id: 1,
      product: "Pain Reliever Tablets",
      currentStock: 100,
      minStock: 20,
    },
    {
      id: 2,
      product: "Digital Blood Pressure Monitor",
      currentStock: 20,
      minStock: 10,
    },
    {
      id: 3,
      product: "Face Mask Pack",
      currentStock: 50,
      minStock: 30,
    },
  ]);

  // Supplier Profile
  const [profile, setProfile] = useState<SupplierProfile>({
    id: 1,
    businessName: "PharmaCo",
    contactEmail: "contact@pharmaco.dz",
    phone: "+213 555 666 777",
    address: "Alger, Algeria",
    licenseNumber: "LIC-ALG-123456",
  });

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-teal-900 text-white flex">
      <SupplierNav activeTab={activeTab} setActiveTab={setActiveTab} />
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

        {activeTab === "products" && (
          <ProductList
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        )}
        {activeTab === "orders" && <OrderHistory orders={orders} />}
        {activeTab === "inventory" && <Inventory stockLevels={stockLevels} />}
        {activeTab === "settings" && (
          <ProfileSettings profile={profile} setProfile={setProfile} />
        )}
      </main>
    </div>
  );
}
