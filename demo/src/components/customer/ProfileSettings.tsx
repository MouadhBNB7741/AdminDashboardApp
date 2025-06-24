import React, { useContext, useState } from "react";
import { type CustomerProfile } from "../../types";
import { AuthContext } from "../../context/context";

interface Props {
  profile: CustomerProfile;
  setProfile: React.Dispatch<React.SetStateAction<CustomerProfile>>;
}

export default function ProfileSettings({ profile, setProfile }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useContext(AuthContext);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = () => {
    alert("Profile updated!");
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg border border-teal-600 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-center text-teal-400">
        Profile Settings
      </h2>

      <div className="mb-5">
        <label className="block text-gray-400 mb-2">User ID</label>
        <input
          type="text"
          value={profile.id}
          disabled
          className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-400 mb-2">Full Name</label>
        <input
          type="text"
          value={user?.name || "N/A"}
          disabled
          className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-400 mb-2">Date of Birth</label>
        <input
          type="date"
          name="date_of_birth"
          value={profile.date_of_birth || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-400 mb-2">Gender</label>
        <select
          name="gender"
          value={profile.gender || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-gray-400 mb-2">National ID</label>
        <input
          type="text"
          name="national_id"
          value={profile.national_id || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-400 mb-2">Profession</label>
        <input
          type="text"
          name="profession"
          value={profile.profession || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-400 mb-2">Medical License</label>
        <input
          type="text"
          name="medical_license"
          value={profile.medical_license || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-400 mb-2">Organization Name</label>
        <input
          type="text"
          name="organization_name"
          value={profile.organization_name || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-400 mb-2">Organization Type</label>
        <select
          name="organization_type"
          value={profile.organization_type || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
        >
          <option value="">Select Type</option>
          <option value="hospital">Hospital</option>
          <option value="clinic">Clinic</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="individual">Individual</option>
        </select>
      </div>

      {isEditing ? (
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="bg-teal-600 hover:bg-teal-700 px-6 py-2 rounded w-full transition"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded w-full transition"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="bg-teal-600 hover:bg-teal-700 px-6 py-2 rounded w-full mt-6 transition"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
}
