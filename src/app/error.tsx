"use client";
import React from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      {error?.message && (
        <p className="text-sm text-gray-500 mb-4 max-w-xl break-words">{error.message}</p>
      )}
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800"
        >
          Try again
        </button>
        <button
          onClick={() => (typeof window !== "undefined" ? window.location.reload() : reset())}
          className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
        >
          Reload
        </button>
      </div>
      {error?.digest && (
        <p className="mt-3 text-xs text-gray-400">Error ID: {error.digest}</p>
      )}
    </div>
  );
}
