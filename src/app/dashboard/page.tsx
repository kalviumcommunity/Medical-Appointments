export default function DashboardPage() {
  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-black text-white">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">
        Medical Appointments
      </h1>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 rounded-xl bg-gray-800">
          <h2 className="text-lg font-semibold">Doctor</h2>
          <p className="text-gray-400">Dr. Suresh</p>
        </div>

        <div className="p-4 rounded-xl bg-gray-800">
          <h2 className="text-lg font-semibold">Date</h2>
          <p className="text-gray-400">28 Jan 2026</p>
        </div>

        <div className="p-4 rounded-xl bg-gray-800">
          <h2 className="text-lg font-semibold">Status</h2>
          <p className="text-green-400">Confirmed</p>
        </div>
      </div>
    </div>
  );
}
