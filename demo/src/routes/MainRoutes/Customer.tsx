import { useContext, useState } from "react";
import CustomerNav from "../../components/customer/DashboardNav";
import ProductList from "../../components/customer/ProductList";
import CartSummary from "../../components/customer/CartSummary";
import OrderHistory from "../../components/customer/OrderHistory";
import ProfileSettings from "../../components/customer/ProfileSettings";
import { type CustomerProfile, type Product } from "../../types";
import { AuthContext } from "../../context/context";

export default function CustomerDashboard() {
  // === STATE ===
  const [activeTab, setActiveTab] = useState<
    "products" | "cart" | "orders" | "settings"
  >("products");

  const { user } = useContext(AuthContext);

  // Mock Customer Profile
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

  // Mock Products
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

  // Shopping Cart
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(
    []
  );

  // Orders (empty for now)
  const [orders] = useState<
    {
      id: number | string;
      date: string;
      items: string[];
      total: number;
    }[]
  >([]);

  // Handlers
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

    // In real app: POST to API
    alert(`Order placed: ${newOrder.id}`);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <CustomerNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto ml-64">
        <h1 className="text-2xl font-bold mb-6">Welcome Back, {user!.name}!</h1>

        {activeTab === "products" && (
          <ProductList products={products} addToCart={addToCart} />
        )}

        {activeTab === "cart" && (
          <CartSummary
            cart={cart}
            setCart={setCart}
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
