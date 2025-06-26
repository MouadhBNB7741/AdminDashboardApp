import React, { useState } from "react";

export default function SettingsTab() {
  const [settings, setSettings] = useState({
    appName: "MediShop",
    maintenanceMode: false,
    defaultTheme: "dark",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setSettings((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    alert("Settings updated!");
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg border border-teal-600">
      <h2 className="text-2xl font-bold mb-6 text-center text-teal-400">
        Admin Settings
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-400 mb-2">App Name</label>
          <input
            type="text"
            name="appName"
            value={settings.appName}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
          />
        </div>

        <div>
          <label className="inline-flex items-center text-gray-400">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="mr-2"
            />
            Enable Maintenance Mode
          </label>
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Default Theme</label>
          <select
            name="defaultTheme"
            value={settings.defaultTheme}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={handleSave}
          className="bg-teal-600 hover:bg-teal-700 px-6 py-2 rounded text-white transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
