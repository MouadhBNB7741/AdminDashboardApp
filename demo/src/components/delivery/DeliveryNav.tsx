import { useContext, useState } from "react";
import { AuthContext } from "../../context/context";

interface Props {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<"deliveries" | "settings">>;
}

export default function DeliveryNav({ activeTab, setActiveTab }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:block w-64 bg-gray-800 p-6 h-screen fixed shadow-lg border-r border-teal-700">
        <h2 className="text-xl font-semibold mb-6 text-teal-400 flex items-center gap-2">
          🚚 Dashboard
        </h2>
        <ul className="space-y-3 pb-6">
          <NavItem
            label="My Deliveries"
            icon="📦"
            tab="deliveries"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <NavItem
            label="Profile Settings"
            icon="⚙️"
            tab="settings"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </ul>
        <LogoutButton logout={logout} />
      </nav>

      {!isMobileMenuOpen && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden fixed top-3 left-4 z-50 p-3 bg-gray-800 rounded text-white text-xl font-bold"
          aria-label="Open menu"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 p-6 shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0">
            <h2 className="text-xl font-semibold mb-6 text-teal-400 flex items-center gap-2">
              🚚 Dashboard
            </h2>
            <ul className="space-y-3 pb-6">
              <NavItem
                label="My Deliveries"
                icon="📦"
                tab="deliveries"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
              <NavItem
                label="Profile Settings"
                icon="⚙️"
                tab="settings"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
            </ul>
            <LogoutButton logout={logout} />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-white text-xl"
            >
              ×
            </button>
          </div>
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        </div>
      )}
    </>
  );
}

interface NavItemProps {
  label: string;
  icon: string;
  tab: "deliveries" | "settings";
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<"deliveries" | "settings">>;
  setIsMobileMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

function NavItem({
  label,
  icon,
  tab,
  activeTab,
  setActiveTab,
  setIsMobileMenuOpen,
}: NavItemProps) {
  return (
    <li>
      <button
        onClick={() => {
          setActiveTab(tab);
          if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
        }}
        className={`w-full text-left px-4 py-2 rounded-lg transition ${
          activeTab === tab ? "bg-teal-600 text-white" : "hover:bg-gray-700"
        }`}
      >
        <span className="flex items-center gap-2">
          {icon} {label}
        </span>
      </button>
    </li>
  );
}

function LogoutButton({ logout }: { logout: () => void }) {
  return (
    <div className="mt-auto pt-6 border-t border-gray-700">
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 font-medium transition"
      >
        🔐 Logout
      </button>
    </div>
  );
}
