import { cleanupUserData } from "@/features/auth/actions/cleanup";

export function TestingButtons() {
  const handleCleanup = async () => {
    if (confirm("🚨 Dit verwijdert ALLE je data. Weet je het zeker?")) {
      try {
        const result = await cleanupUserData();
        alert(
          `✅ Cleanup complete! Removed: ${JSON.stringify(result.deleted)}`
        );
        window.location.reload(); // Refresh om lege staat te zien
      } catch (error) {
        alert(`❌ Cleanup failed: ${error}`);
      }
    }
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
