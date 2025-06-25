import { useContext, useState } from "react";
import CustomerNav from "../../components/customer/DashboardNav";
import ProductList from "../../components/customer/ProductList";
import CartSummary from "../../components/customer/CartSummary";
import OrderHistory from "../../components/customer/OrderHistory";
import ProfileSettings from "../../components/customer/ProfileSettings";
import { type CustomerProfile, type Product } from "../../types";
import { AuthContext } from "../../context/context";
import { type Order } from "../../components/customer/OrderHistory";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<
    "products" | "cart" | "orders" | "settings"
  >("products");

  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState<CustomerProfile>({
    id: 1,
    user_id: parseInt(user!.id),
    date_of_birth: "1985-06-15",
    gender: "male",
    national_id: "123456789012345678",
    profession: "General Practitioner",
    medical_license: "MED-123456",
    organization_name: "City Medical Center",
    organization_type: "hospital",
  });

  const [products] = useState<Product[]>([
    {
      id: 1,
      supplier_id: 101,
      category_id: 5,
      sku: "PROD-001",
      name_en: "Pain Reliever Tablets",
      description_en: "Fast acting pain relief tablets",
      short_description_en: "Relieve headaches and body pain quickly.",
      weight: 0.02,
      price: 450.0,
      image: "https://picsum.photos/id/1/300/200",
    },
    {
      id: 2,
      supplier_id: 102,
      category_id: 6,
      sku: "PROD-002",
      name_en: "Digital Blood Pressure Monitor",
      description_en: "Home-use blood pressure monitor",
      short_description_en: "Monitor your BP at home easily.",
      weight: 0.5,
      price: 3500.0,
      image: "https://picsum.photos/id/2/300/200",
    },
    {
      id: 3,
      supplier_id: 103,
      category_id: 7,
      sku: "PROD-003",
      name_en: "Face Mask Pack",
      description_en: "Disposable surgical masks - 50 pcs",
      short_description_en: "Protective face masks for personal use.",
      weight: 0.1,
      price: 800.0,
      image: "https://picsum.photos/id/3/300/200",
    },
  ]);

  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(
    []
  );

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "manshine city",
      date: Date.now().toString(),
      items: ["manaPotion", "shield"],
      total: 4500,
      status: "Processing",
    },
    {
      id: "bastard muunikh",
      date: Date.now().toString(),
      items: ["manaPotion", "shield"],
      total: 4500,
      status: "Processing",
    },
    {
      id: "pxg",
      date: Date.now().toString(),
      items: ["manaPotion", "shield"],
      total: 4500,
      status: "Processing",
    },
    {
      id: "main",
      date: Date.now().toString(),
      items: ["manaPotion", "shield"],
      total: 4500,
      status: "Processing",
    },
  ]);

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const increaseQuantity = (productId: number) => {
    setCart(
      cart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCart(
      cart
        .map((item) =>
          item.product.id === productId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const checkout = () => {
    if (cart.length === 0) return;

    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString().split("T")[0],
      status: "Processing",
      total: cart.reduce(
        (sum, item) => sum + item.product.price! * item.quantity,
        0
      ),
      items: cart.map((item) => item.product.name_en),
    };
    const res = [...orders, newOrder];
    setOrders(res);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-teal-900 text-white flex">
      <CustomerNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-4 md:p-8 overflow-auto md:ml-64 bg-gray-900">
        <div className="flex justify-end items-center mb-8 md:justify-between">
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
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("cart")}
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13h9m-9 4h10a2 2 0 002-2v-1a2 2 0 00-2-2H5a2 2 0 00-2 2v1a2 2 0002 2z"
                />
              </svg>
            </button>
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

        {activeTab === "products" && (
          <ProductList products={products} addToCart={addToCart} />
        )}
        {activeTab === "cart" && (
          <CartSummary
            cart={cart}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            removeFromCart={removeFromCart}
            checkout={checkout}
          />
        )}
        {activeTab === "orders" && <OrderHistory orders={orders} />}
        {activeTab === "settings" && (
          <ProfileSettings profile={profile} setProfile={setProfile} />
        )}
      </main>
    </div>
  );
}
