"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

function BeanForm({ onClose, onSubmitSuccess, initialData, isEditing }) {
  const router = useRouter();
  const [roaster, setRoaster] = useState(initialData?.roaster || "");
  const [origin, setOrigin] = useState(initialData?.origin || "");
  const [aroma, setAroma] = useState(initialData?.aroma || "");
  const [taste, setTaste] = useState(initialData?.taste || "");
  const [rating, setRating] = useState(initialData?.rating || 3);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isEditing
      ? `/api/entries/${initialData.id}`
      : "/api/entries";
    const method = isEditing ? "PUT" : "POST";

    await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roaster, origin, aroma, taste, rating }),
    });

    setRoaster("");
    setOrigin("");
    setAroma("");
    setTaste("");
    setRating(3);
    router.refresh();
    onSubmitSuccess?.();
    onClose();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b flex justify-between items-center bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? "Edit Bean Entry" : "Add New Bean"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto flex flex-col"
      >
        <div className="flex-1 p-6 space-y-6">
          <div>
            <label
              htmlFor="roaster"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Roaster
            </label>
            <input
              type="text"
              id="roaster"
              value={roaster}
              onChange={(e) => setRoaster(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label
              htmlFor="origin"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Origin
            </label>
            <input
              type="text"
              id="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label
              htmlFor="aroma"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Aroma
            </label>
            <textarea
              id="aroma"
              value={aroma}
              onChange={(e) => setAroma(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows={3}
              required
            />
          </div>

          <div>
            <label
              htmlFor="taste"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Taste
            </label>
            <textarea
              id="taste"
              value={taste}
              onChange={(e) => setTaste(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows={3}
              required
            />
          </div>

          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Rating
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                id="rating"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                required
              />
              <span className="text-gray-700 font-medium">{rating}/5</span>
            </div>
          </div>
        </div>

        <div className="border-t bg-gray-50 p-6">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {isEditing ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default BeanForm;
