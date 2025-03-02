"use client";

import { Transition } from "@headlessui/react";
import { useEffect } from "react";

export default function Snackbar({ show, message, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <Transition
      show={show}
      className="fixed bottom-4 left-1/2 -translate-x-1/2"
      enter="transform transition ease-out duration-150"
      enterFrom="translate-y-full"
      enterTo="translate-y-0"
      leave="transform transition ease-in duration-150"
      leaveFrom="translate-y-0"
      leaveTo="translate-y-full"
    >
      <div className="bg-gray-800 text-white px-6 py-3 rounded shadow-lg">
        {message}
      </div>
    </Transition>
  );
}
