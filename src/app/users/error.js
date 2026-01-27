"use client";

export default function Error({ error, reset }) {
  return (
    <div className="p-6 text-red-500">
      ❌ Something went wrong: {error.message}
      <button
        onClick={() => reset()}
        className="ml-2 px-3 py-1 bg-red-100 text-red-700 rounded"
      >
        Retry
      </button>
    </div>
  );
}
