import React, { useState } from "react";

interface Props {
  onSearch: (term: string) => void;
}

export default function SearchUser({ onSearch }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
      />
    </div>
  );
}
