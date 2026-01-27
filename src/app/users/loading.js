export default function Loading() {
  return (
    <div className="p-6">
      <div className="h-10 bg-gray-200 rounded flex items-center justify-center animate-pulse">
        <span className="text-gray-500 font-medium">Loading users...</span>
      </div>
    </div>
  );
}
