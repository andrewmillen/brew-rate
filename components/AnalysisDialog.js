"use client";

import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export default function DeleteConfirmation({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-50">
        <DialogPanel className="bg-white p-6 rounded-lg shadow-xl max-w-3xl w-full mx-4">
          <DialogTitle className="text-xl font-semibold mb-4">
            📊 Coffee Preference Analysis
          </DialogTitle>
          <p className="mb-4">
            When you've added at least 3 entries, you can analyze your coffee
            preferences. The analysis will identify your favorite regions,
            roasters, and bean characteristics based on your ratings.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              onClick={onClose}
              className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-gray-400"
            >
              Dismiss
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
