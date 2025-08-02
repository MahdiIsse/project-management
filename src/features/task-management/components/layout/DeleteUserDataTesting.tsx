import { cleanupUserData } from "@/features/auth/actions/cleanup";

export function TestingButtons() {
  const handleCleanup = async () => {
    await cleanupUserData();
  };

  return (
    <div className=" bg-red-100 p-4 rounded border">
      <p className="text-sm text-red-600 mb-2">🧪 Development Testing</p>
      <button
        onClick={handleCleanup}
        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
      >
        🧹 Cleanup All Data
      </button>
    </div>
  );
}
