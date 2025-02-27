"use client";

import { useEffect, useState } from "react";

import BeanForm from "@/components/BeanForm";
import BeanLog from "@/components/BeanLog";
import { Button } from "@headlessui/react";

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
    <main>
      <div className="bg-blue-100 pb-16 -mb-16">
        <div className="container mx-auto flex justify-between items-center px-8 py-16">
          <h1 className="text-2xl font-bold">☕️ Brew Rate</h1>
          <Button
            onClick={() => setIsDrawerOpen(true)}
            className="px-4 py-2 text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Bean
          </Button>
        </div>
      </div>

      <div className="container mx-auto">
        <BeanLog onEdit={handleEdit} />
      </div>
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
