import { useState } from "react";
import { type User } from "../../types";
import EditUserForm from "./EditUserForm";
import SearchUser from "./SearchUser";

interface Props {
  users: User[];
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export default function UserManagement({
  users,
  onEditUser,
  onDeleteUser,
}: Props) {
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    name: "",
    mail: "",
    password: "",
    type: "customer",
  });

  const [filteredUsers, setFilteredUsers] = useState(users);

  const handleSearch = (term: string) => {
    if (!term.trim()) {
      setFilteredUsers(users);
      return;
    }

    const lowerTerm = term.toLowerCase();
    setFilteredUsers(
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(lowerTerm) ||
          u.mail.toLowerCase().includes(lowerTerm)
      )
    );
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.mail || !newUser.password) return;

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const newUserObj = {
      id: Date.now().toString(),
      ...newUser,
    };

    localStorage.setItem("users", JSON.stringify([...storedUsers, newUserObj]));
    setNewUser({ name: "", mail: "", password: "", type: "customer" });
    alert("User added!");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-teal-400">
        User Management
      </h2>

      {/* Add New User Form */}
      <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow border border-teal-600">
        <h3 className="text-lg font-medium mb-4">Add New User</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="p-3 bg-gray-700 border border-gray-600 rounded text-white"
          />
          <input
            placeholder="Email"
            value={newUser.mail}
            onChange={(e) => setNewUser({ ...newUser, mail: e.target.value })}
            className="p-3 bg-gray-700 border border-gray-600 rounded text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className="p-3 bg-gray-700 border border-gray-600 rounded text-white"
          />
          <select
            value={newUser.type}
            onChange={(e) => setNewUser({ ...newUser, type: e.target.value })}
            className="p-3 bg-gray-700 border border-gray-600 rounded text-white"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="supplier">Supplier</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>
        <button
          onClick={handleAddUser}
          className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded text-white"
        >
          Add User
        </button>
      </div>

      {/* Search Box */}
      <SearchUser onSearch={handleSearch} />

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-700">
                <td className="px-4 py-3">{user.id}</td>
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.mail}</td>
                <td className="px-4 py-3 capitalize">{user.type}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteUser(user.id)}
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
      {editingUser && (
        <EditUserForm
          user={editingUser}
          onSave={(updatedUser) => onEditUser(updatedUser)}
          onCancel={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}
