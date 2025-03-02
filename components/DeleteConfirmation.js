"use client";

import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export default function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  entryDetails,
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-50">
        <DialogPanel className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full mx-4">
          <DialogTitle className="text-xl font-semibold mb-4">
            Confirm Delete
          </DialogTitle>

          <p className="mb-4">
            Are you sure you want to delete the entry for{" "}
            <span className="font-semibold">
              {entryDetails.roaster} - {entryDetails.origin}
            </span>
            ?
          </p>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              onClick={onClose}
              className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="px-4 py-2 text-white border border-red-800 rounded-md shadow-sm bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Delete
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
