"use client";
import { Fragment } from "react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isWarning = false,
}) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-admin-surface text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-admin-muted/10">
                <div className="p-6">
                  <div className="sm:flex sm:items-start">
                    <div
                      className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${isWarning ? "bg-red-100" : "bg-amber-100"}`}
                    >
                      <ExclamationTriangleIcon
                        className={`h-6 w-6 ${isWarning ? "text-red-600" : "text-amber-600"}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <DialogTitle
                        as="h3"
                        className="text-base font-semibold leading-6 text-admin-text-primary"
                      >
                        {title}
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm text-admin-text-muted">
                          {message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-admin-bg px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-admin-accent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 sm:ml-3 sm:w-auto"
                    onClick={onConfirm}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-admin-surface px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
