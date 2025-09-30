import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-200 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Medication Interaction Checker
        </h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Disclaimer:</strong> This is for demonstration purposes
            only. Not real medical advice.
          </p>
        </div>
        <Link
          href="/interactions"
          className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Check Interactions →
        </Link>
      </div>
    </main>
  );
}
