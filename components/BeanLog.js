"use client";

import { useEffect, useState } from "react";

import DeleteConfirmation from "@/components/DeleteConfirmation";
import EmptyState from "@/components/EmptyState";
import StarRating from "@/components/StarRating";

function BeanLog({ onEdit }) {
  const [entries, setEntries] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    entryToDelete: null,
  });

  const fetchEntries = async () => {
    const response = await fetch("/api/entries");
    const data = await response.json();
    setEntries(data);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleDelete = (entry) => {
    setDeleteModal({
      isOpen: true,
      entryToDelete: entry,
    });
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `/api/entries/${deleteModal.entryToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }

      await fetchEntries();
      setDeleteModal({ isOpen: false, entryToDelete: null });
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    if (sortConfig.key === "date") {
      return sortConfig.direction === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    if (sortConfig.key === "rating") {
      return sortConfig.direction === "asc"
        ? a.rating - b.rating
        : b.rating - a.rating;
    }
    return sortConfig.direction === "asc"
      ? a[sortConfig.key]?.localeCompare(b[sortConfig.key])
      : b[sortConfig.key]?.localeCompare(a[sortConfig.key]);
  });

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {entries.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer bg-gray-50"
                  onClick={() => handleSort("date")}
                >
                  Date{" "}
                  {sortConfig.key === "date" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer bg-gray-50"
                  onClick={() => handleSort("roaster")}
                >
                  Roaster{" "}
                  {sortConfig.key === "roaster" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer bg-gray-50"
                  onClick={() => handleSort("origin")}
                >
                  Origin{" "}
                  {sortConfig.key === "origin" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Aroma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Taste
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer bg-gray-50"
                  onClick={() => handleSort("rating")}
                >
                  Rating{" "}
                  {sortConfig.key === "rating" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedEntries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.roaster}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.origin}
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs overflow-hidden text-ellipsis">
                      {entry.aroma}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs overflow-hidden text-ellipsis">
                      {entry.taste}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StarRating rating={entry.rating} readOnly={true} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onEdit(entry)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(entry)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, entryToDelete: null })}
        onConfirm={confirmDelete}
        entryDetails={deleteModal.entryToDelete || {}}
      />
    </div>
  );
}

export default BeanLog;
