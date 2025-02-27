"use client";

import {
  Button,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { useEffect, useState } from "react";

import DeleteConfirmation from "@/components/DeleteConfirmation";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
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

  const renderSortableHeader = (key, label) => {
    const isActive = sortConfig.key === key;
    return (
      <th
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer bg-gray-50 group"
        onClick={() => handleSort(key)}
      >
        <div className="flex items-center space-x-1">
          <span>{label}</span>
          <span
            className={`${
              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
            }`}
          >
            {isActive && sortConfig.direction === "asc" ? "↑" : "↓"}
          </span>
        </div>
      </th>
    );
  };

  return (
    <div className="flex flex-col h-full border border-gray-200 shadow-sm mb-16">
      {entries.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {renderSortableHeader("date", "Date")}
                {renderSortableHeader("roaster", "Roaster")}
                {renderSortableHeader("origin", "Origin")}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Aroma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Taste
                </th>
                {renderSortableHeader("rating", "Rating")}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <span className="sr-only">Actions</span>
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
                    <Popover className="relative">
                      <PopoverButton
                        className="p-2 bg-white border border-gray-200 shadow-sm hover:bg-gray-100 focus:bg-gray-100 rounded-full focus:outline-none focus:ring-offset-2 focus:ring-2 focus:ring-blue-500"
                        aria-label="Close"
                      >
                        <EllipsisHorizontalIcon className="w-6 h-6" />
                      </PopoverButton>
                      <PopoverPanel
                        anchor="bottom end"
                        className="flex flex-col items-end py-1 bg-white rounded border border-gray-200 shadow-md w-40"
                      >
                        <Button
                          onClick={() => onEdit(entry)}
                          className="py-2 px-3 bg-white hover:bg-gray-50 w-full text-left"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(entry)}
                          className="py-2 px-3 bg-white hover:bg-gray-50 w-full text-left text-red-500"
                        >
                          Delete
                        </Button>
                      </PopoverPanel>
                    </Popover>
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
