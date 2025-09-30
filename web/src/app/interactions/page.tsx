"use client";

import { useState } from "react";
import InteractionForm from "../components/InteractionForm";
import ResultCard from "../components/ResultCard";
import RecentChecks from "../components/RecentChecks";
import type { InteractionResult, RecentCheck } from "../models";

export default function InteractionsPage() {
  const [result, setResult] = useState<InteractionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [recentChecks, setRecentChecks] = useState<RecentCheck[]>([]);

  const handleSubmit = async (medA: string, medB: string) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/interactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ medA, medB }),
      });

      if (!response.ok) {
        throw new Error("Failed to check interaction");
      }

      const data: InteractionResult = await response.json();
      setResult(data);

      const newCheck: RecentCheck = {
        medA,
        medB,
        isPotentiallyRisky: data.isPotentiallyRisky,
        timestamp: new Date().toISOString(),
      };

      setRecentChecks((prev) => [newCheck, ...prev].slice(0, 5));
    } catch (error) {
      console.error("Error checking interaction:", error);
      setResult({
        medications: [medA, medB],
        isPotentiallyRisky: false,
        reason: "Error occurred while checking interaction",
        advice: "Please try again or contact support if the problem persists.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center text-gray-800 mb-8">
          <h1 className="text-4xl font-bold mb-2">
            💊 Medication Interaction Checker
          </h1>
          <p className="text-lg opacity-80">
            Check for potential drug interactions
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-gray-700 text-sm">
            <strong>⚠️ Important:</strong> This is a mock educational tool.
            Results are not real medical advice. Always consult healthcare
            professionals for actual medication guidance.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <InteractionForm onSubmit={handleSubmit} loading={loading} />

          {loading && (
            <div className="flex justify-center items-center py-6">
              <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-blue-600">Checking...</span>
            </div>
          )}

          {!loading && result && <ResultCard result={result} />}
        </div>

        {recentChecks.length > 0 && <RecentChecks checks={recentChecks} />}
      </div>
    </main>
  );
}
