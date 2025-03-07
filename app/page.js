"use client";

import { useEffect, useState } from "react";

import AnalysisDialog from "@/components/AnalysisDialog";
import BeanForm from "@/components/BeanForm";
import BeanLog from "@/components/BeanLog";
import { Button } from "@headlessui/react";
import Snackbar from "@/components/Snackbar";

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [entries, setEntries] = useState([]);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
  });

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/entries");
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    const handleRefresh = () => fetchEntries();
    window.addEventListener("refreshEntries", handleRefresh);
    return () => window.removeEventListener("refreshEntries", handleRefresh);
  }, []);

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingEntry(null);
  };

  const showSnackbar = (message) => {
    setSnackbar({ show: true, message });
  };

  return (
    <main>
      <div className="container mx-auto flex justify-between items-center px-6 py-16">
        <h1 className="text-3xl font-bold">☕️ Brew Rate</h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowAnalysis(true)}
            className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-gray-400"
          >
            Analyze
          </Button>
          <Button
            onClick={() => setIsDrawerOpen(true)}
            className="px-4 py-2 text-white border border-blue-800 rounded-md shadow-sm bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Bean
          </Button>
        </div>
      </div>

      <div className="container mx-auto">
        <BeanLog
          entries={entries}
          onEdit={handleEdit}
          onDelete={() => {
            fetchEntries();
            showSnackbar("Entry deleted");
          }}
        />
      </div>

      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleCloseDrawer}
          />
          <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform">
            <BeanForm
              initialData={editingEntry}
              isEditing={!!editingEntry}
              onClose={handleCloseDrawer}
              onSubmitSuccess={() => {
                handleCloseDrawer();
                fetchEntries();
                showSnackbar(editingEntry ? "Entry updated" : "Entry added");
              }}
            />
          </div>
        </>
      )}

      <Snackbar
        show={snackbar.show}
        message={snackbar.message}
        onClose={() => setSnackbar({ show: false, message: snackbar.message })}
      />

      <AnalysisDialog
        isOpen={showAnalysis}
        onClose={() => setShowAnalysis(false)}
        entries={entries}
      />
    </main>
  );
}
