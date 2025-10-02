import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: React.ReactNode;
  cancelText?: string;
  loading?: boolean;
}

const Confirm: React.FC<ConfirmProps> = ({
  open,
  onConfirm,
  onCancel,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={onCancel}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity z-[9998]" />
        </Transition.Child>
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
            leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                    {title}
                  </Dialog.Title>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-sm text-gray-600">
                  {description}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 transition cursor-pointer"
                  onClick={onCancel}
                  disabled={loading}
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-r from-[#D4AF37] to-[#F2D675] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-[#C4A030] hover:to-[#E2C665] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 transition disabled:opacity-60"
                  onClick={onConfirm}
                  disabled={loading}
                  style={{ cursor: 'pointer' }}
                >
                  {loading ? 'Processing...' : confirmText}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Confirm; 