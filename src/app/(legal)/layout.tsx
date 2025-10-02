// app/(legal)/layout.tsx
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';
import Footer  from '@/components/layout/Footer';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const [showNotification, setShowNotification] = useState(true);

  return (
    <>
      <Header />
      
      {/* Development Preview Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-40 bg-amber-50 border-b border-amber-200 shadow-sm"
          >
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <p className="text-sm font-medium text-amber-900">
                    <span className="font-semibold">Preview Version:</span> Sonity by VELIESSA is under active development.
                    You may experience performance variations. Your data remains fully secure and protected.
                  </p>
                </div>
                <button
                  onClick={() => setShowNotification(false)}
                  className="flex-shrink-0 p-1 rounded-lg text-amber-600 hover:text-amber-800 hover:bg-amber-100 transition-colors"
                  aria-label="Dismiss notification"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`${showNotification ? 'pt-28' : 'pt-16'} transition-all duration-300`}>
        {children}
      </div>

      <Footer />
    </>
  );
}
