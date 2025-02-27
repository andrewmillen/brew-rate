"use client";

import {
  Button,
  Field,
  FocusTrap,
  Input,
  Label,
  Textarea,
} from "@headlessui/react";
import React, { useEffect, useRef, useState } from "react";

import StarRating from "./StarRating";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

function BeanForm({ onClose, onSubmitSuccess, initialData, isEditing }) {
  const router = useRouter();
  const roasterInputRef = useRef(null);
  const [roaster, setRoaster] = useState(initialData?.roaster || "");
  const [origin, setOrigin] = useState(initialData?.origin || "");
  const [aroma, setAroma] = useState(initialData?.aroma || "");
  const [taste, setTaste] = useState(initialData?.taste || "");
  const [rating, setRating] = useState(initialData?.rating || 3);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

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
    <FocusTrap className="h-full flex flex-col" initialFocus={roasterInputRef}>
      <div className="px-6 py-4 border-b flex justify-between items-center bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? "Edit Bean Entry" : "Add Bean"}
        </h2>
        <Button
          onClick={onClose}
          className="p-2 bg-white border border-gray-200 shadow-sm hover:bg-gray-100 focus:bg-gray-100 rounded-full focus:outline-none focus:ring-offset-2 focus:ring-2 focus:ring-blue-500"
          aria-label="Close"
        >
          <XMarkIcon className="w-6 h-6" />
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="overflow-y-auto flex flex-col flex-1"
      >
        <div className="flex-1 p-6 space-y-6">
          <Field>
            <Label
              htmlFor="roaster"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Roaster*
            </Label>
            <Input
              ref={roasterInputRef}
              type="text"
              id="roaster"
              value={roaster}
              onChange={(e) => setRoaster(e.target.value)}
              className="w-full p-2 border border-gray-300 hover:border-gray-400 rounded-md shadow-sm focus:border-gray-400 focus:outline-none focus:ring-offset-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </Field>

          <Field>
            <Label
              htmlFor="origin"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Origin*
            </Label>
            <Input
              type="text"
              id="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full p-2 border border-gray-300 hover:border-gray-400 rounded-md shadow-sm focus:border-gray-400 focus:outline-none focus:ring-offset-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </Field>

          <Field>
            <Label
              htmlFor="aroma"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Aroma
            </Label>
            <Textarea
              id="aroma"
              value={aroma}
              onChange={(e) => setAroma(e.target.value)}
              className="w-full p-2 border border-gray-300 hover:border-gray-400 rounded-md shadow-sm focus:border-gray-400 focus:outline-none focus:ring-offset-2 focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </Field>

          <Field>
            <Label
              htmlFor="taste"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Taste
            </Label>
            <Textarea
              id="taste"
              value={taste}
              onChange={(e) => setTaste(e.target.value)}
              className="w-full p-2 border border-gray-300 hover:border-gray-400 rounded-md shadow-sm focus:border-gray-400 focus:outline-none focus:ring-offset-2 focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </Field>

          <Field>
            <Label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Rating*
            </Label>
            <StarRating rating={rating} onChange={setRating} />
          </Field>
        </div>

        <div className="border-t bg-gray-50 p-6 flex justify-end space-x-3">
          <Button
            type="Button"
            onClick={onClose}
            className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-gray-400"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isEditing ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </FocusTrap>
  );
}

export default BeanForm;
