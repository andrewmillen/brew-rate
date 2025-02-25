"use client";

import { useEffect, useState } from "react";

import BeanForm from "@/components/BeanForm";
import BeanLog from "@/components/BeanLog";

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    const handleOpenForm = () => setIsDrawerOpen(true);
    window.addEventListener("openBeanForm", handleOpenForm);
    return () => window.removeEventListener("openBeanForm", handleOpenForm);
  }, []);

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingEntry(null);
  };

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4 py-8">
        <h1 className="text-2xl font-bold">Brew Rate</h1>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Entry
        </button>
      </div>

      <BeanLog onEdit={handleEdit} />

      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleCloseDrawer}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform">
            <BeanForm
              initialData={editingEntry}
              isEditing={!!editingEntry}
              onClose={handleCloseDrawer}
              onSubmitSuccess={handleCloseDrawer}
            />
          </div>
        </>
      )}
    </main>
  );
}
